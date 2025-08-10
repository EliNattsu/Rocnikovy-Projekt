document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const sendResetRequestBtn = document.getElementById('sendResetRequest');
    const checkEmailMessage = document.getElementById('checkEmailMessage');
    const loginForm = document.querySelector('.login-panel form');

    // Tlačítko zobrazit/skrýt heslo
    const togglePasswordChk = document.getElementById('togglePassChk');
    const passwordInput = document.getElementById('password');
    togglePasswordChk.addEventListener('change', () => {
        passwordInput.type = togglePasswordChk.checked ? 'text' : 'password';
    });

    // Zapomenuté heslo – vyjede obnovovací část
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
        document.querySelector('.welcome-text').style.display = 'none';
    });

    // Odeslání obnovy hesla
    sendResetRequestBtn.addEventListener('click', () => {
        const email = document.getElementById('resetEmail').value.trim();
        if (!email) {
            alert('Prosím, zadejte e-mail.');
            return;
        }
        forgotPasswordForm.style.display = 'none';
        checkEmailMessage.style.display = 'block';
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        let error = false;

        // E-mail validace
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

        // Heslo validace
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
        if (error) e.preventDefault();
    });
});