document.addEventListener('DOMContentLoaded', () => {
    // Ovládání hamburger menu
    const hamButton = document.getElementById('ham-button');
    const mobileMenu = document.getElementById('menu-mobile');

    if (hamButton && mobileMenu) {
        hamButton.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('active');
            hamButton.classList.toggle('open');
            // Přístupnost
            if (hamButton.classList.contains('open')) {
                hamButton.setAttribute('aria-label', 'Zavřít menu');
            } else {
                hamButton.setAttribute('aria-label', 'Otevřít menu');
            }
        });
    }

    // Přepnutí "Přihlásit se" <-> "Můj profil" podle přihlášení
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const desktopLink = document.getElementById("login-profile-link");
    const mobileLink = document.getElementById("login-profile-link-mobile");

    if (isLoggedIn) {
        if (desktopLink) {
            desktopLink.textContent = "Můj profil";
            desktopLink.href = "AccountPage.html";
        }
        if (mobileLink) {
            mobileLink.textContent = "Můj profil";
            mobileLink.href = "AccountPage.html";
        }
    } else {
        if (desktopLink) {
            desktopLink.textContent = "Přihlásit se";
            desktopLink.href = "LoginPage.html";
        }
        if (mobileLink) {
            mobileLink.textContent = "Přihlásit se";
            mobileLink.href = "LoginPage.html";
        }
    }
});