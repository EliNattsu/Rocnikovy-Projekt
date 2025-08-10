document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const token = await apiRequest("/auth/login", "POST", { email, password });

        // uloží token
        localStorage.setItem("token", token);

        alert("Přihlášení úspěšné!");

        // ⬇⬇⬇ tady je přesměrování kam chceš
        window.location.href = "index.html"; // nebo homepage.html nebo profil.html

    } catch (err) {
        alert("Chyba: " + err.message);
    }
});