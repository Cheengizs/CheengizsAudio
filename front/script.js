const localhost = "http://localhost:5272";

const cupsize = document.querySelector(".cupsize");
const cupsizeStop = document.querySelector(".cupsize-stop");
const cupsizeRestart = document.querySelector(".cupsize-restart");
const cupsizeSeek = document.querySelector(".cupsize-seek");
const trackTime = document.querySelector(".track-time");
const startText = document.querySelector(".start-text");
const endText = document.querySelector(".end-text");

let audioList = 0;
let currTrack = 1;

let audio = 0;
async function someFunc() {
  await fetch(localhost + `/audio/${currTrack}`)
    .then((response) => response.blob())
    .then((blob) => {
      if (audio instanceof Audio) {
        audio.pause();
      }
      const audioUrl = URL.createObjectURL(blob);
      console.log(blob);
      audio = new Audio(audioUrl);
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration; // duration in seconds
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60)
          .toString()
          .padStart(2, "0");
        endText.textContent = `${minutes}:${seconds}`;

        audio.addEventListener("timeupdate", async () => {
          const minutes = Math.floor(audio.currentTime / 60);
          const seconds = Math.floor(audio.currentTime % 60)
            .toString()
            .padStart(2, "0");
          startText.textContent = `${minutes}:${seconds}`;
        });
      });
    });
}

cupsize.addEventListener("click", () => {
  audio.play();
});

cupsizeStop.addEventListener("click", () => {
  audio.pause();
});

cupsizeRestart.addEventListener("click", () => {
  audio.load();
});

cupsizeSeek.addEventListener("click", () => {
  const time = trackTime.value;
  audio.fastSeek(time);
});

async function createList(list) {
  list.forEach(async (item) => {
    let temp = item;
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.borderRadius = "6px";

    const button = document.createElement("button");
    button.textContent = `Кнопка для "${temp.title}"`;

    button.addEventListener("click", async () => {
      currTrack = temp.id;
      await someFunc();
    });

    div.appendChild(button);

    document.body.appendChild(div);
  });
}

window.addEventListener("load", async () => {
  await fetch(localhost + "/")
    .then(async (response) => {
      audioList = await response.json();
    })
    .catch();

  console.log(audioList);

  createList(audioList);
  // Wait for the audio metadata to load before using duration
});
