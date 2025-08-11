document.addEventListener('DOMContentLoaded', () => {
    // ---------- Zobrazit/Skrýt heslo ----------
    const togglePasswordChk = document.getElementById('togglePassChk');
    const passwordInput = document.getElementById('password');
    if (togglePasswordChk && passwordInput) {
        togglePasswordChk.addEventListener('change', () => {
            passwordInput.type = togglePasswordChk.checked ? 'text' : 'password';
        });
    }

    // ---------- Přihlášení uživatele ----------
    const loginPanelForm = document.getElementById('loginForm');
    if (loginPanelForm) {
        loginPanelForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            let error = false;
            const emailEl = document.getElementById('email');
            const emailErr = document.getElementById('email-error');
            if (emailEl.value.trim() === '') {
                emailErr.textContent = 'Prosím zadejte e-mail!';
                emailEl.classList.add('chybne');
                error = true;
            } else {
                emailErr.textContent = '';
                emailEl.classList.remove('chybne');
            }

            const passwordEl = document.getElementById('password');
            const passErr = document.getElementById('password-error');
            if (passwordEl.value.trim() === '') {
                passErr.textContent = 'Prosím zadejte heslo!';
                passwordEl.classList.add('chybne');
                error = true;
            } else {
                passErr.textContent = '';
                passwordEl.classList.remove('chybne');
            }

            if (error) return;

            const data = {
                email: emailEl.value.trim(),
                passwordHash: passwordEl.value
            };

            try {
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const text = await res.text();
                if (res.ok) {
                    try {
                        localStorage.setItem("isLoggedIn", "true");
                        localStorage.setItem("userEmail", data.email);
                    } catch (storageErr) {
                        console.warn("⚠️ Nelze zapsat localStorage:", storageErr);
                    }

                    // Redirect okamžitě
                    window.location.href = "AccountPage.html";
                } else {
                    alert(text || "Neplatné přihlašovací údaje.");
                }
            } catch (err) {
                alert("Chyba při přihlašování, zkuste to prosím znovu.");
            }
        });
    }
});