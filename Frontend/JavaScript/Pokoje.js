document.addEventListener('DOMContentLoaded', () => {
// Rozkliknutí detailu každého pokoje
    document.querySelectorAll('.show-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const moreText = button.nextElementSibling;
            if (moreText.style.display === 'block') {
                moreText.style.display = 'none';
                button.textContent = 'Zobrazit více';
                } else {
                moreText.style.display = 'block';
                button.textContent = 'Zobrazit méně';
            }
        });
    });
});