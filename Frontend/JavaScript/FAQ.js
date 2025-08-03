document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            if (answer.hasAttribute('hidden')) {
                answer.removeAttribute('hidden');
            } else {
                answer.setAttribute('hidden', '');
            }
        });
    });
});