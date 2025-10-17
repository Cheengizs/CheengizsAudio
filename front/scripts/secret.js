const API_BASE_URL = "http://localhost:5272/api/v1";

const time = document.querySelector(".time");
const secretText = document.querySelector(".secret-text");

window.onload = async () => {
  const authInfo = getCookie("jwt");

  try {
    const response = await fetch(API_BASE_URL + "/auth/test", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authInfo}`,
      },
    });

    console.log(authInfo);

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      secretText.textContent =
        "You have access to the secret content! " + result.information;
      time.textContent = `Current Time: ${result.dateAndTime}`;
    } else {
      time.textContent = "ACCCEEESSS DENIED";
      secretText.textContent = "Access denied. Please log in.";
    }
  } catch (error) {}
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
