import showErrorPage from "./errorPageFunction.js";
import isNumber from "./isNumberFunction.js";
import formatTime from "./formatTimeFunction.js";

const API_BASE_URL = "http://localhost:5272/api/v1";

let audioList;
let audioIndex = 0;
let audio = new Audio();

window.onload = async () => {
  const parameters = new URLSearchParams(window.location.search);

  const playlistId = parameters.get("playlistId");
  const audioId = parameters.get("audioId");

  if (
    (!playlistId && !audioId) ||
    (!isNumber(playlistId) && !isNumber(audioId))
  ) {
    console.log(playlistId);
    if (isNumber(playlistId)) {
      console.log("piasnfdiansdfijna");
    }
    if (isNumber(audioId)) console.log("199191910394i102349");
    showErrorPage();
  }
  let audioContext = {
    playlistId: playlistId != null ? Number(playlistId) : null,
    audioId: audioId != null ? Number(audioId) : null,
  };

  const response = await fetch(API_BASE_URL + "/audio/getList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(audioContext),
  });

  audioList = await response.json();
  console.log(audioList);
  audioIndex = 0;

  await setAndLoadTrack();
};

const currTimeSpan = document.querySelector("#current-time");
const totalTimeSpan = document.querySelector("#total-time");

async function setAndLoadTrack() {
  if (audioIndex >= audioList.length) {
    const responce = await fetch(API_BASE_URL + "/audio/getRandom");
    const track = await responce.json();
    audioList.push(track);
  }

  document.querySelector(".track-name").innerText =
    audioList[audioIndex].trackName;
  document.querySelector(".author-name").innerText =
    audioList[audioIndex].authorName;

  const audioId = audioList[audioIndex].id;
  try {
    const responseAudioBlob = await fetch(
      API_BASE_URL + `/audio/download/${audioId}`
    );

    const blob = await responseAudioBlob.blob();
    const link = await URL.createObjectURL(blob);
    audio = new Audio(link);
    audio.autoplay = true;
    audio.playbackRate = 1;
    currTimeSpan.innerText = "00:00";

    audio.addEventListener("ended", async () => {
      audioIndex++;
      await setAndLoadTrack();
      audio.play();
    });

    audio.addEventListener("loadedmetadata", async () => {
      totalTimeSpan.innerText = await formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", async () => {
      if (!audio.duration) return;

      currTimeSpan.innerText = await formatTime(audio.currentTime);
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + "%";
    });
  } catch {
    showErrorPage();
  }

  try {
    console.log("oiadsfhiadshfiasduf");
    const responseImageBlob = await fetch(
      API_BASE_URL + `/audio/photo/${audioId}`
    );
    if (!responseImageBlob.ok) {
      showErrorPage();
      return;
    }

    const blobImage = await responseImageBlob.blob();
    const linkImage = await URL.createObjectURL(blobImage);
    console.log(blobImage);
    document.querySelector("#main_photo").src = linkImage;
    document.querySelector(
      ".background"
    ).style.backgroundImage = `url('${linkImage}')`;
  } catch {
    document.querySelector("#main_photo").src = "./imageLoadFailed.png";
  }
}

const panel = document.querySelector(".control-panel");
const playBtn = document.getElementById("play-btn");
const timeline = document.getElementById("timeline");
const progress = document.getElementById("progress");

let isPlaying = false;
let hideTimeout;

// Show panel when mouse moves to bottom of screen
document.addEventListener("mousemove", (e) => {
  const windowHeight = window.innerHeight;
  const mouseY = e.clientY;

  // Show panel when mouse is in bottom 80px
  if (mouseY > windowHeight - 80) {
    panel.classList.add("visible");

    // Clear any existing hide timeout
    clearTimeout(hideTimeout);
  } else if (mouseY < windowHeight - 200) {
    // Hide panel when mouse moves away from bottom area
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      panel.classList.remove("visible");
    }, 500);
  }
});

// Keep panel visible when hovering over it
panel.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  panel.classList.add("visible");
});

panel.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(() => {
    panel.classList.remove("visible");
  }, 500);
});

// Play/Pause
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    document.querySelector(".background").style.animationPlayState = "paused"; // pause background animation
  } else {
    audio.play();
    document.querySelector(".background").style.animationPlayState = "running"; // resume animation
  }
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? "⏸" : "▶";
});

// Timeline control
timeline.addEventListener("click", (e) => {
  if (!audio.duration) return; // prevent errors if audio not loaded

  const rect = timeline.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;

  audio.currentTime = percent * audio.duration;
});

// Prev/Next buttons
document.getElementById("prev-btn").addEventListener("click", async () => {
  console.log("Previous track");
  if (audioIndex > 0) {
    if (audio instanceof Audio) audio.pause();
    audioIndex--;
    await setAndLoadTrack();
    audio.play();
  }
});

document.getElementById("next-btn").addEventListener("click", async () => {
  console.log("Next track");
  if (audio instanceof Audio) audio.pause();
  audioIndex++;
  await setAndLoadTrack();
  audio.play();
});
