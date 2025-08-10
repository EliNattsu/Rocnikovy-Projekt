document.addEventListener("DOMContentLoaded", async () => {
    // 1. Přepínání záložek
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

    // 2. Přihlášení: pokud není, redirect na LoginPage
    const email = localStorage.getItem("userEmail");
    if (!email) {
        window.location.href = "LoginPage.html";
        return;
    }

    // 3. Načti detail majitele (profil)
    let userData = null;
    try {
        const res = await fetch(`http://localhost:8080/api/users/by-email?email=${encodeURIComponent(email)}`);
        if (res.ok) {
            userData = await res.json();
            document.getElementById("owner-firstname").innerText = userData.firstName;
            document.getElementById("owner-lastname").innerText = userData.lastName;
            document.getElementById("owner-email").innerText = userData.email;
            document.getElementById("owner-phone").innerText = userData.phoneNumber || '';
        }
    } catch (err) {
        alert("Chyba načítání uživatele.");
        return;
    }

    // 4. Funkce Odhlásit se
    document.querySelector(".logout-btn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "LoginPage.html";
    });

    // 5. Editace majitele (profil)
    document.querySelector(".owner-edit-btn").addEventListener("click", () => {
        if (!userData) return;
        const newFirstName = prompt("Nové jméno:", userData.firstName);
        const newLastName = prompt("Nové příjmení:", userData.lastName);
        const newPhone = prompt("Nový telefon:", userData.phoneNumber || "");
        if (newFirstName && newLastName) {
            fetch(`http://localhost:8080/api/users/${userData.userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...userData,
                    firstName: newFirstName,
                    lastName: newLastName,
                    phoneNumber: newPhone
                })
            })
                .then(resp => resp.ok ? resp.json() : Promise.reject())
                .then(updated => {
                    document.getElementById("owner-firstname").innerText = updated.firstName;
                    document.getElementById("owner-lastname").innerText = updated.lastName;
                    document.getElementById("owner-phone").innerText = updated.phoneNumber || '';
                    userData = updated;
                    alert("Údaje byly upraveny.");
                })
                .catch(() => alert("Chyba při úpravě údajů."));
        }
    });

    // 6. Načtení koček uživatele
    let cats = [];
    const catsListEl = document.getElementById("cats-list");
    function renderCatsList() {
        catsListEl.innerHTML = "";
        cats.forEach(cat => {
            const catEl = document.createElement("div");
            catEl.className = "cat-item";
            catEl.innerHTML = `
                <b>${cat.name}</b> (Věk: ${cat.age}) 
                <button class="cat-details-btn">Detaily</button>
                <button class="cat-edit-btn">Upravit</button>
                <button class="cat-delete-btn">Smazat</button>
                <div class="cat-details" style="display:none;">
                    <p>Speciální potřeby: ${cat.specialNeeds || "Žádné"}</p>
                </div>
            `;
            catsListEl.appendChild(catEl);

            // Buttons
            catEl.querySelector(".cat-details-btn").addEventListener("click", () => {
                const detailsEl = catEl.querySelector(".cat-details");
                detailsEl.style.display = detailsEl.style.display === "block" ? "none" : "block";
            });
            catEl.querySelector(".cat-edit-btn").addEventListener("click", () => {
                const newName = prompt("Jméno kočky:", cat.name);
                const newAge = prompt("Věk kočky:", cat.age);
                const newNeeds = prompt("Speciální potřeby:", cat.specialNeeds || "");
                if (newName && newAge) {
                    fetch(`http://localhost:8080/api/cats/${cat.catId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...cat,
                            name: newName,
                            age: Number(newAge),
                            specialNeeds: newNeeds,
                            userId: userData.userId // případně pole podle modelu
                        })
                    })
                        .then(resp => resp.ok ? resp.json() : Promise.reject())
                        .then(updated => {
                            Object.assign(cat, updated);
                            renderCatsList();
                            alert("Kočka upravena.");
                        })
                        .catch(() => alert("Chyba při úpravě kočky."));
                }
            });
            catEl.querySelector(".cat-delete-btn").addEventListener("click", () => {
                if (confirm(`Opravdu smazat ${cat.name}?`)) {
                    fetch(`http://localhost:8080/api/cats/${cat.catId}`, { method: "DELETE" })
                        .then(resp => resp.ok ? cat.catId : Promise.reject())
                        .then(() => {
                            cats = cats.filter(c => c.catId !== cat.catId);
                            renderCatsList();
                            alert("Kočka smazána.");
                        })
                        .catch(() => alert("Smazání se nezdařilo."));
                }
            });
        });
    }
    // Přidat kočku
    document.querySelector(".add-cat-btn").addEventListener("click", () => {
        const name = prompt("Jméno kočky:");
        const age = prompt("Věk kočky:");
        const needs = prompt("Speciální potřeby:");
        if (name && age) {
            fetch("http://localhost:8080/api/cats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, age: Number(age), specialNeeds: needs, userId: userData.userId
                })
            })
                .then(resp => resp.ok ? resp.json() : Promise.reject())
                .then(newCat => {
                    cats.push(newCat);
                    renderCatsList();
                    alert("Kočka přidána.");
                })
                .catch(() => alert("Nelze přidat kočku."));
        }
    });

    // Načíst ze serveru
    try {
        const catsRes = await fetch(`http://localhost:8080/api/cats/by-user/${userData.userId}`);
        if (catsRes.ok) cats = await catsRes.json();
        renderCatsList();
    } catch { /* Kočky se nenačetly */ }

    // 7. Načtení rezervací
    let reservations = [];
    const reservationsListEl = document.getElementById("reservations-list");
    function renderReservationsList() {
        reservationsListEl.innerHTML = "";
        reservations.forEach(reservation => {
            const resEl = document.createElement("div");
            resEl.className = "reservation-item";
            resEl.innerHTML = `
                <b>Rezervace od ${reservation.startDate} do ${reservation.endDate}</b>
                <button class="res-details-btn">Detaily</button>
                <button class="res-edit-btn">Upravit</button>
                <button class="res-delete-btn">Zrušit</button>
                <div class="res-details" style="display:none;">
                    <p>Status: ${reservation.status}</p>
                    <p>Kočka: ${reservation.catId}</p>
                </div>
            `;
            reservationsListEl.appendChild(resEl);

            resEl.querySelector(".res-details-btn").addEventListener("click", () => {
                const detailsEl = resEl.querySelector(".res-details");
                detailsEl.style.display = detailsEl.style.display === "block" ? "none" : "block";
            });

            // Upravit rezervaci
            resEl.querySelector(".res-edit-btn").addEventListener("click", () => {
                const newStart = prompt("Nový začátek (YYYY-MM-DD):", reservation.startDate);
                const newEnd = prompt("Nový konec (YYYY-MM-DD):", reservation.endDate);
                const newStatus = prompt("Nový status:", reservation.status);
                if (newStart && newEnd && newStatus) {
                    fetch(`http://localhost:8080/api/reservations/${reservation.reservationId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...reservation,
                            startDate: newStart,
                            endDate: newEnd,
                            status: newStatus
                        })
                    })
                        .then(resp => resp.ok ? resp.json() : Promise.reject())
                        .then(updated => {
                            Object.assign(reservation, updated);
                            renderReservationsList();
                            alert("Rezervace upravena.");
                        })
                        .catch(() => alert("Chyba při úpravě rezervace."));
                }
            });

            // Smazat rezervaci
            resEl.querySelector(".res-delete-btn").addEventListener("click", () => {
                if (confirm("Opravdu zrušit rezervaci?")) {
                    fetch(`http://localhost:8080/api/reservations/${reservation.reservationId}`, { method: "DELETE" })
                        .then(resp => resp.ok ? reservation.reservationId : Promise.reject())
                        .then(() => {
                            reservations = reservations.filter(r => r.reservationId !== reservation.reservationId);
                            renderReservationsList();
                            alert("Rezervace zrušena.");
                        })
                        .catch(() => alert("Nelze zrušit rezervaci."));
                }
            });
        });
    }
    // Načíst rezervace ze serveru
    try {
        const resRes = await fetch(`http://localhost:8080/api/reservations/by-user/${userData.userId}`);
        if (resRes.ok) reservations = await resRes.json();
        renderReservationsList();
    } catch { /* Rezervace se nenačetly */ }

    // 8. Změna hesla (tab settings)
    document.getElementById("settings-form").addEventListener("submit", async function(e){
        e.preventDefault();
        const newPw = document.getElementById("new-password").value;
        const confirmPw = document.getElementById("confirm-password").value;
        if (!newPw || newPw !== confirmPw) {
            alert("Hesla se neshodují!");
            return;
        }
        const oldPw = prompt("Zadejte původní heslo:");
        if (!oldPw) return;

        const resp = await fetch(`http://localhost:8080/api/users/${userData.userId}/change-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw })
        });
        if (resp.ok) {
            alert("Heslo úspěšně změněno.");
            document.getElementById("new-password").value = "";
            document.getElementById("confirm-password").value = "";
        } else {
            alert("Heslo nelze změnit, původní není správné.");
        }
    });
});