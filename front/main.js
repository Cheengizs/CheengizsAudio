import showErrorPage from "./errorPageFunction.js";

const API_BASE_URL = "http://localhost:5272/api/v1";

window.onload = async () => {
  await loadAudios();
  await loadPlaylists();
};
async function loadAudios() {
  try {
    for (let i = 0; i < 6; i++) {
      const response = await fetch(API_BASE_URL + "/audio/getRandom");
      const track = await response.json();
      await createContainerForTrack(
        track,
        document.querySelector("#audio-container")
      );
    }
  } catch {
    showErrorPage();
  }
}

async function loadPlaylists() {
  try {
    for (let i = 0; i < 6; i++) {
      const response = await fetch(API_BASE_URL + "/playlist/getRandom");
      const playlist = await response.json();
      await createContainerForPlaylist(
        playlist,
        document.querySelector("#playlist-container")
      );
    }
  } catch {
    // showErrorPage();
  }
}

async function createContainerForTrack(track, parentElement) {
  const card = document.createElement("div");
  card.className = "card";

  const cardImage = document.createElement("div");
  cardImage.className = "card-image";

  try {
    const imageBlobResponse = await fetch(
      `${API_BASE_URL}/audio/photo/${track.id}`
    );
    const imageBlob = await imageBlobResponse.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    cardImage.style.backgroundImage = `url('${imageObjectURL}')`;
  } catch (error) {
    console.error("Error loading image:", error);
    cardImage.style.background =
      "linear-gradient(135deg, #667eea20, #764ba240)";
  }

  const cardTitle = document.createElement("div");
  cardTitle.className = "card-title";
  cardTitle.textContent = track.trackName || "Untitled Track";

  const cardSubtitle = document.createElement("div");
  cardSubtitle.className = "card-subtitle";
  cardSubtitle.textContent = track.authorName || "Unknown Artist";

  // Append all
  card.appendChild(cardImage);
  card.appendChild(cardTitle);
  card.appendChild(cardSubtitle);

  // Click → go to detail page
  card.addEventListener("click", () => {
    window.location.href = `beautifulAudio.html?audioId=${track.id}`;
  });

  parentElement.appendChild(card);
}

async function createContainerForPlaylist(playlist, parentElement) {
  const card = document.createElement("div");
  card.className = "card";

  const cardImage = document.createElement("div");
  cardImage.className = "card-image";
  const firstTrackResponse = await fetch(
    `${API_BASE_URL}/audio/getFirstTrackFromPlaylist/${playlist.id}`
  );

  const firstTrack = await firstTrackResponse.json();

  try {
    const imageBlobResponse = await fetch(
      `${API_BASE_URL}/audio/photo/${firstTrack.id}`
    );
    console.log(playlist);
    const imageBlob = await imageBlobResponse.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    cardImage.style.backgroundImage = `url('${imageObjectURL}')`;
  } catch (error) {
    console.error("Error loading image:", error);
    cardImage.style.background =
      "linear-gradient(135deg, #667eea20, #764ba240)";
  }

  const cardTitle = document.createElement("div");
  cardTitle.className = "card-title";
  cardTitle.textContent = playlist.title || "Untitled Track";

  const cardSubtitle = document.createElement("div");
  cardSubtitle.className = "card-subtitle";
  cardSubtitle.textContent = playlist.username || "Unknown Artist";

  // Append all
  card.appendChild(cardImage);
  card.appendChild(cardTitle);
  card.appendChild(cardSubtitle);

  // Click → go to detail page
  card.addEventListener("click", () => {
    window.location.href = `beautifulAudio.html?playlistId=${playlist.id}`;
  });

  parentElement.appendChild(card);
}
