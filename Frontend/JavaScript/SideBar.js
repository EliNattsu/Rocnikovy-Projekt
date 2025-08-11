document.addEventListener('DOMContentLoaded', () => {
    // ---------- Ovládání hamburger menu ----------
    const hamButton = document.getElementById('ham-button');
    const mobileMenu = document.getElementById('menu-mobile');

    if (hamButton && mobileMenu) {
        hamButton.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('active');
            hamButton.classList.toggle('open');
            hamButton.setAttribute(
                'aria-label',
                hamButton.classList.contains('open') ? 'Zavřít menu' : 'Otevřít menu'
            );
        });
    }

    // ---------- Přepnutí přihlášení / profil ----------
    let isLoggedIn = false;
    let userEmail = "";
    let firstName = "";
    let lastName = "";

    try {
        isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        userEmail = localStorage.getItem("userEmail") || "";
        firstName = localStorage.getItem("firstName") || "";
        lastName = localStorage.getItem("lastName") || "";
    } catch (e) {
        console.warn("⚠️ localStorage není dostupné, používám výchozí hodnoty:", e);
    }

    const desktopLink = document.getElementById("login-profile-link");
    const mobileLink = document.getElementById("login-profile-link-mobile");

    if (isLoggedIn) {
        // Pokud máme jméno a příjmení, zobrazíme je. Jinak fallback na email.
        let profileText = "Můj profil";
        if (firstName && lastName) {
            profileText = `Můj profil (${firstName} ${lastName})`;
        } else if (userEmail) {
            profileText = `Můj profil (${userEmail})`;
        }

        if (desktopLink) {
            desktopLink.textContent = profileText;
            desktopLink.href = "AccountPage.html";
        }
        if (mobileLink) {
            mobileLink.textContent = profileText;
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