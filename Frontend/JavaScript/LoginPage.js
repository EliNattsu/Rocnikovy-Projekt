document.addEventListener('DOMContentLoaded', () => {
    // ---------- Zobrazit/Skrýt heslo ----------
    const togglePasswordChk = document.getElementById('togglePassChk');
    const passwordInput = document.getElementById('password');
    if (togglePasswordChk && passwordInput) {
        togglePasswordChk.addEventListener('change', () => {
            passwordInput.type = togglePasswordChk.checked ? 'text' : 'password';
        });
    }

    // ---------- Zapomenuté heslo ----------
    const forgotPasswordLink = document.querySelector('.forgot');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const sendResetRequestBtn = document.getElementById('sendResetRequest');
    const checkEmailMessage = document.getElementById('checkEmailMessage');
    const loginPanelForm = document.getElementById('loginForm');
    const welcomeText = document.querySelector('.welcome-text');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginPanelForm) loginPanelForm.style.display = 'none';
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
            if (welcomeText) welcomeText.style.display = 'none';
        });
    }
    if (sendResetRequestBtn) {
        sendResetRequestBtn.addEventListener('click', () => {
            const email = document.getElementById('resetEmail').value.trim();
            if (!email) {
                alert('Prosím zadejte e-mail.');
                return;
            }
            forgotPasswordForm.style.display = 'none';
            checkEmailMessage.style.display = 'block';
            // Pro reálnou obnovu hesla později zde fetch na backend
        });
    }

    // ---------- Přihlášení uživatele ----------
    if (loginPanelForm) {
        loginPanelForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Simple validace
            let error = false;

            const email = document.getElementById('email');
            const emailErr = document.getElementById('email-error');
            if (email.value.trim() === '') {
                emailErr.textContent = 'Prosím zadejte e-mail!';
                email.classList.add('chybne');
                error = true;
            } else {
                emailErr.textContent = '';
                email.classList.remove('chybne');
            }

            const password = document.getElementById('password');
            const passErr = document.getElementById('password-error');
            if (password.value.trim() === '') {
                passErr.textContent = 'Prosím zadejte heslo!';
                password.classList.add('chybne');
                error = true;
            } else {
                passErr.textContent = '';
                password.classList.remove('chybne');
            }

            if (error) return;

            // ---------- Odeslání na backend ----------
            // Připrav data formou { email, password }
            const data = {
                email: email.value.trim(),
                password: password.value
            };

            try {
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userEmail", data.email);

                    alert("Přihlášení proběhlo úspěšně.");
                    window.location.href = "AccountPage.html";
                } else {
                    alert("Neplatné přihlašovací údaje.");
                }
            } catch (error) {
                alert("Chyba při přihlašování, zkuste to prosím znovu.");
            }
        });
    }
});
