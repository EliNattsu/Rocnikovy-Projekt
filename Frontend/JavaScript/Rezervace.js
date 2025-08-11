document.addEventListener('DOMContentLoaded', () => {
    (function () {
        // ----- deklarace elementů -----
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const confirmation = document.getElementById('confirmation');
        const roomsList = document.getElementById('roomsList');
        const receipt = document.getElementById('receipt');
        const catsSelect = document.getElementById('cats');
        const ownersSelect = document.getElementById('owners');
        const searchBtn = document.getElementById('searchBtn');
        const arrivalDateInput = document.getElementById('arrivalDate');
        const departureDateInput = document.getElementById('departureDate');
        const catOnlyBtn = document.getElementById('catOnlyBtn');
        const ownerAndCatBtn = document.getElementById('ownerAndCatBtn');
        const stepsIndicators = [
            document.getElementById('step-indicator-1'),
            document.getElementById('step-indicator-2'),
            document.getElementById('step-indicator-3')
        ];
        const catsInfoFieldset = document.getElementById('catsInfoFieldset');
        const summaryForm = document.getElementById('summaryForm');
        const backToStep1Btn = document.getElementById('backToStep1');
        const lengthOfStaySpan = document.getElementById('lengthOfStay');
        const arrivalDateReceipt = document.getElementById('arrivalDateReceipt');
        const departureDateReceipt = document.getElementById('departureDateReceipt');
        const roomsSummaryList = document.getElementById('roomsSummaryList');
        const totalPriceSpan = document.getElementById('totalPrice');
        const registerCheckbox = document.getElementById('register');
        const passwordContainer = document.getElementById('password-container');
        const passwordInput = document.getElementById('password');

        let selectedRoomType = null;
        let selectedRoom = null;
        let selectedPrice = 0;
        let catsCount = 1;

        // automatické předvyplnění pro přihlášené
        try {
            if (localStorage.getItem("isLoggedIn") === "true") {
                document.getElementById('email').value = localStorage.getItem("userEmail") || '';
                document.getElementById('firstName').value = localStorage.getItem("firstName") || '';
                document.getElementById('lastName').value = localStorage.getItem("lastName") || '';
                document.getElementById('phone').value = localStorage.getItem("userPhone") || '';
            }
        } catch (e) {}

        // zobraz/skrýj pole pro heslo
        function togglePasswordField() {
            if (registerCheckbox && registerCheckbox.checked) {
                passwordContainer.style.display = 'block';
                passwordInput.setAttribute('required', 'required');
            } else {
                passwordContainer.style.display = 'none';
                passwordInput.removeAttribute('required');
                passwordInput.value = '';
            }
        }
        if (registerCheckbox) {
            registerCheckbox.addEventListener('change', togglePasswordField);
            togglePasswordField();
        }

        function updateStepIndicator(currentStep) {
            stepsIndicators.forEach((el, i) => {
                el.classList.toggle('active', i === currentStep - 1);
            });
        }

        function updateRoomTypeButtonsState() {
            const ownersCount = parseInt(ownersSelect.value, 10);
            if (isNaN(ownersCount)) {
                catOnlyBtn.disabled = true;
                ownerAndCatBtn.disabled = true;
                selectedRoomType = null;
                return updateSearchBtnState();
            }
            if (ownersCount > 0) {
                catOnlyBtn.disabled = true;
                ownerAndCatBtn.disabled = false;
                if (selectedRoomType === 'catOnly') selectedRoomType = null;
            } else {
                catOnlyBtn.disabled = false;
                ownerAndCatBtn.disabled = true;
                if (selectedRoomType === 'ownerAndCat') selectedRoomType = null;
            }
            updateSearchBtnState();
        }
        ownersSelect.addEventListener('change', () => {
            updateRoomTypeButtonsState();
            updateSearchBtnState();
        });
        updateRoomTypeButtonsState();

        function validateStep1Inputs() {
            return selectedRoomType && arrivalDateInput.value && departureDateInput.value &&
                new Date(departureDateInput.value) > new Date(arrivalDateInput.value);
        }
        function updateSearchBtnState() {
            searchBtn.disabled = !validateStep1Inputs();
        }
        [arrivalDateInput, departureDateInput, catsSelect].forEach(el => {
            el.addEventListener('change', () => {
                catsCount = parseInt(catsSelect.value, 10);
                updateSearchBtnState();
            });
        });

        searchBtn.addEventListener('click', () => {
            const roomArticles = roomsList.querySelectorAll('article.room');
            roomArticles.forEach(article =>
                article.classList.toggle('hidden', article.dataset.roomtype !== selectedRoomType)
            );
            roomsList.style.display = 'block';
        });

        [catOnlyBtn, ownerAndCatBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                selectedRoomType = btn.dataset.roomtype;
                [catOnlyBtn, ownerAndCatBtn].forEach(b => b.style.backgroundColor = '');
                btn.style.backgroundColor = '#add8e6';
                updateSearchBtnState();
            });
        });

        roomsList.addEventListener('click', e => {
            if (!e.target.classList.contains('reserveBtn')) return;
            const article = e.target.closest('article.room');
            selectedRoom = {
                name: article.querySelector('h4').textContent,
                price: parseInt(article.querySelector('p:nth-of-type(2)').textContent.replace(/\D+/g, '')) || 0
            };
            selectedPrice = selectedRoom.price;
            step1.style.display = 'none';
            roomsList.style.display = 'none';
            step2.style.display = 'block';
            updateStepIndicator(2);
            renderCatForms();
            renderReceipt();
            receipt.style.display = 'block';
            confirmation.style.display = 'none';
            window.scrollTo(0, 0);
        });

        function renderCatForms() {
            catsInfoFieldset.innerHTML = '<legend>Údaje koček</legend>';
            for (let i = 1; i <= catsCount; i++) {
                catsInfoFieldset.insertAdjacentHTML('beforeend', `
                    <div>
                        <h4>Kočka ${i}</h4>
                        <label>Jméno: <span style="color:red">*</span></label>
                        <input type="text" id="catName${i}" required/>
                        <label>Věk: <span style="color:red">*</span></label>
                        <input type="number" id="catAge${i}" min="0" required/>
                        <label>Speciální požadavky:</label>
                        <textarea id="catReq${i}" placeholder="Nepovinné"></textarea>
                        <hr/>
                    </div>
                `);
            }
        }

        function renderReceipt() {
            const arrival = new Date(arrivalDateInput.value);
            const departure = new Date(departureDateInput.value);
            if (!arrivalDateInput.value || !departureDateInput.value) return;
            const diffDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
            lengthOfStaySpan.textContent = diffDays.toString();
            arrivalDateReceipt.textContent = arrival.toLocaleDateString('cs-CZ');
            departureDateReceipt.textContent = departure.toLocaleDateString('cs-CZ');
            roomsSummaryList.innerHTML = `<li>${selectedRoom.name}, Cena: ${selectedRoom.price} Kč</li>`;
            totalPriceSpan.textContent = selectedRoom.price;
        }

        backToStep1Btn.addEventListener('click', () => {
            step2.style.display = 'none';
            receipt.style.display = 'none';
            confirmation.style.display = 'none';
            step1.style.display = 'block';
            updateStepIndicator(1);
            selectedRoom = null;
            selectedPrice = 0;
            summaryForm.reset();
            togglePasswordField();
            window.scrollTo(0, 0);
        });

        // hlavní submit rezervace
        summaryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let userData = null;
            let isLoggedIn = false;
            try { isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; } catch {}

            const registerChecked = registerCheckbox.checked;
            const owner = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phoneNumber: document.getElementById('phone').value.trim()
            };

            function createCatsAndReservation() {
                const catsArray = [];
                let promise = Promise.resolve();

                for (let i = 1; i <= catsCount; i++) {
                    promise = promise.then(() => {
                        const name = document.getElementById(`catName${i}`).value.trim();
                        const age = parseInt(document.getElementById(`catAge${i}`).value, 10);
                        const specialNeeds = document.getElementById(`catReq${i}`).value.trim();
                        const catPayload = { catName: name, age, notes: specialNeeds, user: { userId: userData.userId } };

                        return fetch("http://localhost:8080/api/cats", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(catPayload)
                        }).then(res => {
                            if (!res.ok) {
                                return res.text().then(errText => {
                                    console.error("Chyba při ukládání kočky:", res.status, errText);
                                    alert("Chyba při ukládání kočky: " + errText);
                                    throw new Error();
                                });
                            }
                            return res.json();
                        }).then(cat => catsArray.push(cat));
                    });
                }

                promise.then(() => {
                    const reservation = {
                        startDate: arrivalDateInput.value,
                        endDate: departureDateInput.value,
                        status: "pending",
                        user: { userId: userData.userId },
                        cats: catsArray.map(cat => ({ catId: cat.catId }))
                    };
                    return fetch("http://localhost:8080/api/reservations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(reservation)
                    }).then(res => {
                        if (!res.ok) {
                            return res.text().then(errText => {
                                console.error("Chyba při vytvoření rezervace:", res.status, errText);
                                alert("Chyba při vytvoření rezervace: " + errText);
                                throw new Error();
                            });
                        }
                    });
                }).then(() => {
                    step2.style.display = 'none';
                    receipt.style.display = 'none';
                    confirmation.style.display = 'block';
                    updateStepIndicator(3);
                    window.scrollTo(0, 0);
                }).catch(() => {});
            }

            if (!isLoggedIn) {
                if (registerChecked) {
                    const password = passwordInput.value.trim();
                    if (!password) { alert("Prosím zadejte heslo pro registraci."); return; }
                    owner.passwordHash = password;
                } else {
                    owner.passwordHash = null;
                }
                fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(owner)
                }).then(res => {
                    if (!res.ok) {
                        return res.text().then(errText => {
                            if (res.status === 409) {
                                alert("Účet s tímto e-mailem už existuje.");
                            } else {
                                alert("Chyba registrace (" + res.status + "): " + errText);
                            }
                            console.error("Chyba registrace:", res.status, errText);
                            throw new Error();
                        });
                    }
                    return res.json();
                }).then(user => {
                    userData = user;
                    createCatsAndReservation();
                }).catch(() => {});

            } else {
                const userEmail = localStorage.getItem("userEmail");
                if (!userEmail) { alert("Chybí email."); return; }
                fetch(`http://localhost:8080/api/users/by-email?email=${encodeURIComponent(userEmail)}`)
                    .then(res => {
                        if (!res.ok) { alert("Nepodařilo se načíst uživatele."); throw new Error(); }
                        return res.json();
                    }).then(user => {
                    userData = user;
                    createCatsAndReservation();
                }).catch(() => {});
            }
        });

    })();

    // přednastavení dat kalendáře
    function formatDate(date) {
        const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    const arrivalInput = document.getElementById('arrivalDate');
    const departureInput = document.getElementById('departureDate');
    const today = new Date(), tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    arrivalInput.value = formatDate(today);
    departureInput.value = formatDate(tomorrow);
    arrivalInput.min = formatDate(today);
    departureInput.min = formatDate(tomorrow);
    arrivalInput.addEventListener('change', () => {
        const arrivalDate = new Date(arrivalInput.value);
        const minDeparture = new Date(arrivalDate);
        minDeparture.setDate(arrivalDate.getDate() + 1);
        departureInput.min = formatDate(minDeparture);
        if (new Date(departureInput.value) <= arrivalDate) {
            departureInput.value = formatDate(minDeparture);
        }
    });
});
