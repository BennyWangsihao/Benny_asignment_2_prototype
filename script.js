let recorder;
let chunks = [];
let audio = null;
let loopTimer = null;

const status = document.querySelector("#status");

async function setupMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function (event) {
    chunks.push(event.data);
  };

  recorder.onstop = function () {
    const blob = new Blob(chunks, { type: recorder.mimeType });
    chunks = [];

    audio = new Audio(URL.createObjectURL(blob));

    status.textContent = "Sound recorded. Press Play Loop.";
  };
}

document.querySelector("#recordBtn").addEventListener("click", async function () {
  if (!recorder) {
    await setupMicrophone();
  }

  if (recorder.state === "inactive") {
    chunks = [];
    recorder.start();

    status.textContent = "Recording...";
  }
});

document.querySelector("#stopRecordBtn").addEventListener("click", function () {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
  }
});

document.querySelector("#playBtn").addEventListener("click", function () {
  if (!audio) {
    status.textContent = "Please record a sound first.";
    return;
  }

  clearInterval(loopTimer);

  audio.currentTime = 0;
  audio.play();

  loopTimer = setInterval(function () {
    audio.currentTime = 0;
    audio.play();
  }, 2000);

  status.textContent = "Loop is playing every 2 seconds.";
});

document.querySelector("#stopBtn").addEventListener("click", function () {
  clearInterval(loopTimer);

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  status.textContent = "Loop stopped.";
});