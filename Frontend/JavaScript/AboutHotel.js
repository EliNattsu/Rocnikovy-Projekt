document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.about-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            if (!targetId) return;

            const mainMenu = document.getElementById('main-menu');
            const details = document.querySelector('.about-details');
            const sections = document.querySelectorAll('.details-section');

            // Skryj hlavní nabídku karet
            mainMenu.style.display = 'none';
            // Zobraz sekci detailů
            details.style.display = 'block';
            // Skryj všechny detailní sekce
            sections.forEach(section => (section.style.display = 'none'));
            // Zobraz vybranou detailní sekci
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.style.display = 'block';
        });
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        const mainMenu = document.getElementById('main-menu');
        const details = document.querySelector('.about-details');

        details.style.display = 'none';
        mainMenu.style.display = 'grid'; // grid, aby byla 2x2 mřížka zachována

        // Pro jistotu skryj veškeré detaily
        document.querySelectorAll('.details-section').forEach(section => {
            section.style.display = 'none';
        });
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