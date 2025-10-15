const API_BASE_URL = "http://localhost:5272";

async function sendRequest(endpoint, data, statusElement) {
  statusElement.querySelector(".status-title").textContent = "⏳ Loading...";
  statusElement.querySelector(".status-message").textContent =
    "Sending request to server...";

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

    console.log(
      "sfuhsaufhasuhfisahfdiasdhfiuashdfiuhsafiuhsaiufhuasifhusiadhfiusahf"
    );

    statusElement.className = "status-container show success";
    statusElement.querySelector(".status-title").textContent = "✓ Success";
    statusElement.querySelector(".status-message").textContent =
      "Music added successfully!";
  } catch (error) {
    statusElement.className = "status-container show error";
    statusElement.querySelector(".status-title").textContent = "✗ Error";
    statusElement.querySelector(
      ".status-message"
    ).textContent = `Failed to add music. Please try again.\n${error.error}`;
  }
}

// === MUSIC MANAGEMENT ===
const addMusicBtn = document.querySelector(".musicContainer .btn-primary");
const clearMusicBtn = document.querySelector(".musicContainer .btn-secondary");
const musicStatus = document.querySelector("#music-status");

addMusicBtn.addEventListener("click", async () => {
  const title = document.getElementById("input-music_title").value.trim();
  const author = document.getElementById("input-music_author").value.trim();
  const path = document.getElementById("input-music_path").value.trim();

  if (!title || !author || !path) {
    musicStatus.querySelector(".status-message").textContent =
      "⚠️ Please fill in all fields.";
    musicStatus.className = "status-container show warning";
    return;
  }

  const data = {
    Title: title,
    Author: author,
    Path: path,
  };

  await sendRequest("audio", data, musicStatus);
});

clearMusicBtn.addEventListener("click", () => {
  document.getElementById("input-music_title").value = "";
  document.getElementById("input-music_author").value = "";
  document.getElementById("input-music_path").value = "";
  musicStatus.textContent = "Cleared.";
});

// === PLAYLIST MANAGEMENT ===
const addPlaylistBtn = document.querySelector(
  ".playlist_container .btn-primary"
);
const clearPlaylistBtn = document.querySelector(
  ".playlist_container .btn-secondary"
);
const playlistStatus = document.querySelector(
  "#playlist-status .status-message"
);

addPlaylistBtn.addEventListener("click", async () => {
  const title = document.getElementById("input-playlist_title").value.trim();

  if (!title) {
    playlistStatus.textContent = "⚠️ Please enter a playlist name.";
    return;
  }

  await sendRequest("playlist/create", { title }, playlistStatus);
});

clearPlaylistBtn.addEventListener("click", () => {
  document.getElementById("input-playlist_title").value = "";
  playlistStatus.textContent = "Cleared.";
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
