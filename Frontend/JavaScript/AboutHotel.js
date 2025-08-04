document.addEventListener('DOMContentLoaded', () => {
    const titles = document.querySelectorAll('.about-title');
    const mainMenu = document.getElementById('main-menu');
    const details = document.querySelector('.about-details');
    const detailsSections = document.querySelectorAll('.details-section');
    const backBtn = document.getElementById('back-btn');
    titles.forEach(title => {
        title.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            details.style.display = 'block';
            detailsSections.forEach(section => section.style.display = 'none');
            document.getElementById(title.dataset.target).style.display = 'block';
        });
    });
    backBtn.addEventListener('click', () => {
        details.style.display = 'none';
        mainMenu.style.display = 'flex';
    });
// Accordion na aktuality
    document.querySelectorAll('.accordion-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);
            const content = document.getElementById(btn.getAttribute('aria-controls'));
            if (content.hasAttribute('hidden')) {
                content.removeAttribute('hidden');
            } else {
                content.setAttribute('hidden', '');
            }
        });
    });
});