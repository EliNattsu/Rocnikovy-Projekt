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

    // 2. Ověření přihlášení
    let email = "";
    try {
        email = localStorage.getItem("userEmail");
    } catch (err) {
        console.warn("LocalStorage není dostupné", err);
    }
    if (!email) {
        window.location.href = "LoginPage.html";
        return;
    }

    // 3. Předvyplnění z localStorage (rychlý náhled)
    try {
        const lfName = localStorage.getItem("firstName") || "";
        const llName = localStorage.getItem("lastName") || "";
        const lPhone = localStorage.getItem("userPhone") || "";

        if (lfName) document.getElementById("owner-firstname").innerText = lfName;
        if (llName) document.getElementById("owner-lastname").innerText = llName;
        if (email) document.getElementById("owner-email").innerText = email;
        if (lPhone) document.getElementById("owner-phone").innerText = lPhone;
    } catch (e) {
        console.warn("Nepodařilo se načíst údaje z localStorage", e);
    }

    // 4. Načti aktuální údaje z backendu
    let userData = null;
    try {
        const res = await fetch(`http://localhost:8080/api/users/by-email?email=${encodeURIComponent(email)}`);
        if (res.ok) {
            userData = await res.json();
            document.getElementById("owner-firstname").innerText = userData.firstName;
            document.getElementById("owner-lastname").innerText = userData.lastName;
            document.getElementById("owner-email").innerText = userData.email;
            document.getElementById("owner-phone").innerText = userData.phoneNumber || '';

            try {
                localStorage.setItem("firstName", userData.firstName || "");
                localStorage.setItem("lastName", userData.lastName || "");
                if (userData.phoneNumber) localStorage.setItem("userPhone", userData.phoneNumber);
            } catch (err) {
                console.warn("Nelze uložit údaje uživatele do localStorage", err);
            }
        }
    } catch (err) {
        alert("Chyba načítání uživatele.");
        return;
    }

    // 5. Logout
    document.querySelector(".logout-btn").addEventListener("click", () => {
        try {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("firstName");
            localStorage.removeItem("lastName");
            localStorage.removeItem("userPhone");
        } catch (err) {
            console.warn("Nelze vyčistit localStorage při logoutu", err);
        }
        window.location.href = "LoginPage.html";
    });

    // 6. Editace majitele
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
                    try {
                        localStorage.setItem("firstName", updated.firstName || "");
                        localStorage.setItem("lastName", updated.lastName || "");
                        if (updated.phoneNumber) localStorage.setItem("userPhone", updated.phoneNumber);
                    } catch (err) {
                        console.warn("Nelze uložit data do localStorage po úpravě profilu", err);
                    }
                    alert("Údaje byly upraveny.");
                })
                .catch(() => alert("Chyba při úpravě údajů."));
        }
    });

// 7. Načtení a správa koček
    let cats = [];
    const catsListEl = document.getElementById("cats-list");
    function renderCatsList() {
        catsListEl.innerHTML = "";
        cats.forEach(cat => {
            const catEl = document.createElement("div");
            catEl.className = "cat-item";
            catEl.innerHTML = `
            <b>${cat.catName}</b> (Věk: ${cat.age}) 
            <button class="cat-details-btn">Detaily</button>
            <button class="cat-edit-btn">Upravit</button>
            <button class="cat-delete-btn">Smazat</button>
            <div class="cat-details" style="display:none;">
                <p>Poznámky: ${cat.notes || "Žádné"}</p>
            </div>
        `;
            catsListEl.appendChild(catEl);

            catEl.querySelector(".cat-details-btn").addEventListener("click", () => {
                const detailsEl = catEl.querySelector(".cat-details");
                detailsEl.style.display = detailsEl.style.display === "block" ? "none" : "block";
            });

            catEl.querySelector(".cat-edit-btn").addEventListener("click", () => {
                const newCatName = prompt("Jméno kočky:", cat.catName);
                const newAge = prompt("Věk kočky:", cat.age);
                const newNotes = prompt("Poznámky:", cat.notes || "");
                if (newCatName && newAge) {
                    fetch(`http://localhost:8080/api/cats/${cat.catId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...cat,
                            catName: newCatName,
                            age: Number(newAge),
                            notes: newNotes,
                            userId: userData.userId
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
                if (confirm(`Opravdu smazat ${cat.catName}?`)) {
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

    document.querySelector(".add-cat-btn").addEventListener("click", () => {
        const catName = prompt("Jméno kočky:");
        const age = prompt("Věk kočky:");
        const notes = prompt("Poznámky:");
        if (catName && age) {
            fetch("http://localhost:8080/api/cats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    catName,
                    age: Number(age),
                    notes,
                    userId: userData.userId
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

        fetch(`http://localhost:8080/api/cats/by-user/${userData.userId}`)
            .then(async res => {
                if (!res.ok) {
                    // Načti text pro diagnostiku
                    const text = await res.text();
                    throw new Error(`Chyba ${res.status}: ${text.substring(0, 200)}...`);
                }

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    throw new Error("Odpověď není JSON: " + text.substring(0, 200) + "...");
                }

                return res.json();
            })
            .then(data => {
                console.log("Načtené kočky:", data);
                cats = data;
                renderCatsList();
            })
            .catch(err => {
                console.error("Chyba při načítání koček:", err);
            })

    // 8. Načtení a správa rezervací
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
                    <p>Kočky: ${reservation.cats && reservation.cats.length > 0
                ? reservation.cats.map(cat => cat.catName).join(", ")
                : "Žádná"}</p>
                </div>
            `;
            reservationsListEl.appendChild(resEl);

            resEl.querySelector(".res-details-btn").addEventListener("click", () => {
                const detailsEl = resEl.querySelector(".res-details");
                detailsEl.style.display = detailsEl.style.display === "block" ? "none" : "block";
            });

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

    try {
        fetch(`http://localhost:8080/api/reservations/by-user/${userData.userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Chyba: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                reservations = data;
                console.log("Načtené rezervace:", reservations);
                renderReservationsList();
            })
            .catch(err => {
                console.error("Chyba při načítání rezervací:", err);
            });
    } catch (err) {
        console.error("Neočekávaná chyba:", err);
    }
});