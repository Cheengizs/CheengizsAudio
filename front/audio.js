const API_BASE_URL = "http://localhost:5272/api/v1";

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const downloadBtn = document.getElementById("download");
let audioId = 0;

let audioObject = new Audio();

playBtn.addEventListener("click", async () => {
  audioObject.play();
  document.querySelector(".album-art img").classList.add("rotate");
  document.querySelector(".track-info").classList.add("glow");
});

pauseBtn.addEventListener("click", () => {
  audioObject.pause();
  document.querySelector(".album-art img").classList.remove("rotate");
  document.querySelector(".track-info").classList.remove("glow");
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = audio.src;
  link.download = "audio.mp3";
  link.click();
});

window.onload = async () => {
  // Получаем текущий URL

  const params = new URLSearchParams(window.location.search);
  console.log(params);
  // Достаём нужные параметры
  const trackId = params.get("trackId");

  if (!trackId) {
    document.body.innerHTML = `
      <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: radial-gradient(circle at 20% 20%, #20243a, #0f111a);
      color: white;
      font-family: 'Montserrat', sans-serif;
      flex-direction: column;
      text-align: center;
      ">
      <h1 style="font-size: 4rem; margin-bottom: 1rem;">404</h1>
      <p style="font-size: 1.5rem; opacity: 0.8;">Трек не найден</p>
      </div>
      `;
    return;
  }

  console.log(trackId);
  audioId = trackId;
  console.log(audioId);

  const response = await fetch(API_BASE_URL + `/audio/download/${audioId}`);

  if (!response.ok) {
    console.log(trackId);
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: radial-gradient(circle at 20% 20%, #20243a, #0f111a);
        color: white;
        font-family: 'Montserrat', sans-serif;
        flex-direction: column;
        text-align: center;
      ">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">${response.status}</h1>
        <p style="font-size: 1.5rem; opacity: 0.8;">Ошибка</p>
      </div>
    `;
    return;
  }

  const blob = await response.blob();
  console.log(blob);
  const link = URL.createObjectURL(blob);
  audioObject = new Audio(link);
};
