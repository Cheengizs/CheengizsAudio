const API_BASE_URL = "http://localhost:5272/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const submitBtn = document.getElementById("submitBtn");

  function setError(name, msg) {
    const el = document.querySelector('.error[data-for="' + name + '"]');
    if (el) el.textContent = msg || "";
  }

  function validateEmail(v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !validateEmail(email)) {
      setError("email", "Enter a valid email");
      ok = false;
    } else setError("email", "");

    if (!password || password.length < 6) {
      setError("password", "Password must be at least 6 characters");
      ok = false;
    } else setError("password", "");

    if (!ok) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
      const data = {
        Email: email,
        Password: password,
      };

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.log(res.status);
        throw new Error("Login failed");
      }

      const result = await res.text();
      const token = result; // adjust this depending on your API response structure

      if (token) {
        // Set JWT in a cookie (HttpOnly flag cannot be set from JS)
        document.cookie = `jwt=${token}; path=/; max-age=3600`; // expires in 1 hour
      }

      console.log("JWT saved in cookie:", token);

      // optional redirect: window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("Sign in failed. Check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  });
});
