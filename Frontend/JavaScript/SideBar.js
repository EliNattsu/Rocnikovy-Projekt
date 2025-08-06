document.addEventListener('DOMContentLoaded', () => {
    const hamButton = document.getElementById('ham-button');
    const mobileMenu = document.getElementById('menu-mobile');

    hamButton.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('active');
        hamButton.classList.toggle('open');
        // Změna aria-label pro přístupnost
        if(hamButton.classList.contains('open')){
            hamButton.setAttribute('aria-label', 'Zavřít menu');
        } else {
            hamButton.setAttribute('aria-label', 'Otevřít menu');
        }
    });
});