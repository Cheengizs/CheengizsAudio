const API_BASE_URL = "http://localhost:5272/api/v1";

const audioSelect_input = document.querySelector("#audioSelect_input");
const btn_input = document.querySelector(".btn_input");

async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(API_BASE_URL + "/audio/upload", {
    method: "POST",
    body: form,
  });

  if (response.ok) {
    alert("Файл успешно загружен!");
  } else {
    alert("Ошибка при загрузке файла");
  }
}

btn_input.addEventListener("click", async () => {
  const file = audioSelect_input.files[0];
  if (!file) {
    alert("Выберите файл!");
    return;
  }

  try {
    await uploadFile(file);
  } catch (err) {
    console.error(err);
    alert("Ошибка при отправке файла");
  }
});
