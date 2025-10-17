const API_BASE_URL = "http://localhost:5272/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");

  function setError(name, msg) {
    const el = document.querySelector('.error[data-for="' + name + '"]');
    if (el) el.textContent = msg || "";
  }

  function validateEmail(v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let ok = true;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    if (!username || username.length < 3) {
      setError("username", "Username must be at least 3 characters");
      ok = false;
    } else setError("username", "");
    if (!email || !validateEmail(email)) {
      setError("email", "Enter a valid email");
      ok = false;
    } else setError("email", "");
    if (!password || password.length < 6) {
      setError("password", "Password must be at least 6 characters");
      ok = false;
    } else setError("password", "");
    if (password !== confirm) {
      setError("confirm", "Passwords do not match");
      ok = false;
    } else setError("confirm", "");

    if (!ok) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Replace with real fetch to your API
    try {
      const data = {
        Username: username,
        Password: password,
        Email: email,
      };
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.href = "login.html";
      } else {
        alert("Registration failed. Try again later.");
      }
    } catch (err) {
      alert("Registration failed. Try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
    }
  });
});
