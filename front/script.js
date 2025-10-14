const localhost = "http://localhost:5272";

const cupsize = document.querySelector(".cupsize");
const cupsizeStop = document.querySelector(".cupsize-stop");
const cupsizeRestart = document.querySelector(".cupsize-restart");
const cupsizeSeek = document.querySelector(".cupsize-seek");
const trackTime = document.querySelector(".track-time");
const startText = document.querySelector(".start-text");
const endText = document.querySelector(".end-text");

const buttonSearch = document.querySelector(".button_search");
const trackSearcher = document.querySelector("#track_searcher");
const trackList = document.querySelector(".track_list");

const listOfTracks = [0];

let audioList = 0;
let currTrack = 1;

buttonSearch.addEventListener("click", async () => {
  if (trackSearcher.value === "") {
    showPopup("input is empty, please, try again later");
    return;
  }

  fillMusicList(trackSearcher.value);
});

const play_pause = document.querySelector("#play-pause");
const prevv = document.querySelector("#prevv");
const next = document.querySelector("#next");

next.onclick = async () => {
  console.log(currTrack);
  listOfTracks.push(currTrack);
  await someOtherFunc();
};

prevv.onclick = async () => {
  console.log(currTrack);
  currTrack = listOfTracks[listOfTracks.length - 1];
  listOfTracks.pop();
  someFunc();
};

play_pause.onclick = () => {
  if (audio instanceof Audio) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
};

async function fillMusicList(name) {
  console.log(name);
  const response = await fetch(localhost + "/audio/findByName", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }), // передаем объект с name
  });

  const list = await response.json();
  if (!list) return;

  trackList.replaceChildren();

  list.forEach((item) => {
    trackList.appendChild(createMusicCard(item));
  });
}

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
      audio.play();
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

      audio.addEventListener("ended", async () => {
        someOtherFunc();
      });
    });
}

async function someOtherFunc() {
  const resp = await fetch(localhost + "/audio/random");
  const idishnik = await resp.json();
  console.log(idishnik);
  currTrack = idishnik;
  someFunc();
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

function showPopup(message, duration = 3000) {
  // Create notification element
  const notification = document.createElement("div");
  notification.textContent = message;

  // Style it
  Object.assign(notification.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#333",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity 0.3s",
  });

  document.body.appendChild(notification);

  // Fade in
  requestAnimationFrame(() => {
    notification.style.opacity = 1;
  });

  // Remove after duration
  setTimeout(() => {
    notification.style.opacity = 0;
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, duration);
}

function createMusicCard(music) {
  // Create main container
  const curr = music.id;
  const card = document.createElement("div");
  Object.assign(card.style, {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "16px",
    margin: "10px",
    width: "250px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  });

  // Author
  const author = document.createElement("h3");
  author.textContent = music.author;
  Object.assign(author.style, {
    margin: "0 0 8px 0",
    fontSize: "18px",
    color: "#333",
  });

  // name
  const name = document.createElement("p");
  name.textContent = music.title;
  Object.assign(name.style, {
    margin: "0 0 12px 0",
    color: "#555",
  });

  // Buttons container
  const btnContainer = document.createElement("div");
  Object.assign(btnContainer.style, {
    display: "flex",
    justifyContent: "space-between",
  });

  // Play button
  const playBtn = document.createElement("button");
  playBtn.textContent = "Play";
  Object.assign(playBtn.style, {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  });
  playBtn.addEventListener("click", () => {
    currTrack = curr;
    someFunc();
  });

  // Add to Favorites button
  const favBtn = document.createElement("button");
  favBtn.textContent = "❤️";
  Object.assign(favBtn.style, {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#FF4081",
    color: "#fff",
    cursor: "pointer",
  });
  favBtn.onclick = () => alert(`${music.name} added to favorites!`);

  // Append buttons
  btnContainer.appendChild(playBtn);
  btnContainer.appendChild(favBtn);

  // Append elements to card
  card.appendChild(author);
  card.appendChild(name);
  card.appendChild(btnContainer);

  // Append card to body or a container
  return card;
}
