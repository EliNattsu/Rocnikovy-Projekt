document.addEventListener('DOMContentLoaded', () => {
    // Přepínání záložek
    const tabs = document.querySelectorAll('.account-tabs .tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetId = 'tab-' + tab.dataset.tab;
            panes.forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.style.display = 'block';
        });
    });

// Detaily kočky
    document.querySelectorAll('.cat-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.parentElement.nextElementSibling;
            if (details) details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });
    });

// Detaily rezervace
    document.querySelectorAll('.res-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.parentElement.nextElementSibling;
            if (details) details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });
    });

// Přidat/Upravit kočku
    document.querySelectorAll('.add-cat-btn, .cat-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Zde bude formulář pro přidání/upravení kočky.');
        });
    });

// Upravit/Zrušit rezervaci
    document.querySelectorAll('.res-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Zde bude formulář pro úpravu rezervace.');
        });
    });
    document.querySelectorAll('.res-cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Opravdu chcete zrušit tuto rezervaci?')) {
                alert('Rezervace zrušena.');
            }
        });
    });

// Zobrazit detail kočky/rezervace rovnou, pokud je jen jedna
    const showSingleDetails = (listClass, detailsClass) => {
        const list = document.querySelector(listClass);
        if (list && list.children.length === 1) {
            const details = list.querySelector(detailsClass);
            if (details) details.style.display = 'block';
        }
    };

    showSingleDetails('.cat-list', '.cat-details');
    showSingleDetails('.reservations-list', '.res-details');

    // Přidání funkce pro tlačítko Upravit u majitele
    const ownerEditBtn = document.querySelector('.owner-edit-btn');
    if (ownerEditBtn) {
        ownerEditBtn.addEventListener('click', () => {
            alert('Zde bude formulář pro úpravu údajů majitele');
        });
    }
});