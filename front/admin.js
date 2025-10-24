import API_BASE_URL from "./constants.js";

function statusSuccess(statusElement) {
  statusElement.className = "status-container show success";
  statusElement.querySelector(".status-title").textContent = "✓ Success";
  statusElement.querySelector(".status-message").textContent =
    "Music added successfully!";
}

function statusLoading(statusElement) {
  statusElement.querySelector(".status-title").textContent = "⏳ Loading...";
  statusElement.querySelector(".status-message").textContent =
    "Sending request to server...";
}

function statusError(statusElement, error) {
  statusElement.className = "status-container show error";
  statusElement.querySelector(".status-title").textContent = "✗ Error";
  statusElement.querySelector(
    ".status-message"
  ).textContent = `Failed to add music. Please try again.\n${error.error}`;
}

function statusWarning(statusElement) {
  statusElement.querySelector(".status-message").textContent =
    "⚠️ Please fill in all fields.";
  statusElement.className = "status-container show warning";
}

async function sendRequest(endpoint, data, statusElement) {
  statusLoading(statusElement);
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    statusSuccess(statusElement);
  } catch (error) {
    statusError(statusElement, error);
  }
}

async function deleteRequest(endpoint, data, statusElement) {
  statusLoading(statusElement);
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${data}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    statusSuccess(statusElement);
  } catch (error) {
    statusError(statusElement, error);
  }
}

// === MUSIC MANAGEMENT ===
const addMusicBtn = document.querySelector(".musicContainer #btn-add-music");
const removeMusicBtn = document.querySelector(
  ".musicContainer #btn-remove-music"
);
const clearMusicBtn = document.querySelector(
  ".musicContainer #btn-clear-music"
);
const musicStatus = document.querySelector("#music-status");

addMusicBtn.addEventListener("click", async () => {
  const title = document.getElementById("input-music_title").value.trim();
  const author = document.getElementById("input-music_author").value.trim();
  const path = document.getElementById("input-music_path").value.trim();
  const userId = document.getElementById("input-user-id").value.trim();

  if (!title || !author || !path || !userId) {
    statusWarning(musicStatus);
    return;
  }

  const data = {
    Title: title,
    Author: author,
    Path: path,
    UserId: Number(userId),
  };

  await sendRequest("audio", data, musicStatus);
});

clearMusicBtn.addEventListener("click", () => {
  document.getElementById("input-music_title").value = "";
  document.getElementById("input-music_author").value = "";
  document.getElementById("input-music_path").value = "";
  musicStatus.textContent = "Cleared.";
});

removeMusicBtn.addEventListener("click", async () => {
  const title = document.getElementById("input-music_title").value.trim();

  if (!title) {
    statusWarning(musicStatus);
    return;
  }

  const data = title;

  await deleteRequest("audio", data, musicStatus);
});

// === PLAYLIST MANAGEMENT ===
const addPlaylistBtn = document.querySelector(
  ".playlist_container #btn-create-playlist"
);
const clearPlaylistBtn = document.querySelector(
  ".playlist_container #btn-clear-playlist"
);
const playlistStatus = document.querySelector("#playlist-status");
const trackAddToPlaylistStatus = document.querySelector(
  "#track-add-to-playlist-status"
);

addPlaylistBtn.addEventListener("click", async () => {
  const title = document.getElementById("input-playlist_title").value.trim();
  const userId = document.querySelector("#input-playlist_userid").value.trim();

  if (!title || !userId) {
    statusWarning(playlistStatus);
    return;
  }

  const data = {
    Title: title,
    UserId: userId,
  };
  await sendRequest("playlist", data, playlistStatus);
});

clearPlaylistBtn.addEventListener("click", () => {
  document.getElementById("input-playlist_title").value = "";
  playlistStatus.textContent = "Cleared.";
});

const addAudioToPlaylistBtn = document.querySelector("#btn-add-to-playlist");
addAudioToPlaylistBtn.addEventListener("click", async () => {
  const audioId = document.getElementById("input-audio-id").value.trim();

  const playlistId = document.getElementById("input-playlist-id").value.trim();

  if (!audioId || !playlistId) {
    statusWarning(playlistStatus);
    return;
  }

  const data = {
    AudioId: Number(audioId),
    PlaylistId: Number(playlistId),
  };

  await sendRequest(
    "playlist/addTrackToPlaylist",
    data,
    trackAddToPlaylistStatus
  );
});

// === USER MANAGEMENT ===
const addUserBtn = document.querySelector(".user_container .btn-primary");
const clearUserBtn = document.querySelector(".user_container .btn-secondary");
const userStatus = document.querySelector("#user-status .status-message");

addUserBtn.addEventListener("click", async () => {
  const username = document.getElementById("input-user-username").value.trim();

  if (!username) {
    userStatus.textContent = "⚠️ Please enter a username.";
    return;
  }

  await sendRequest("users/add", { username }, userStatus);
});

clearUserBtn.addEventListener("click", () => {
  document.getElementById("input-user-username").value = "";
  userStatus.textContent = "Cleared.";
});
