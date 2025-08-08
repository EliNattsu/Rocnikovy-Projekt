document.addEventListener('DOMContentLoaded', () => {
    (function() {
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
            document.getElementById('step-indicator-3'),
        ];

        const catsInfoFieldset = document.getElementById('catsInfoFieldset');
        const summaryForm = document.getElementById('summaryForm');
        const backToStep1Btn = document.getElementById('backToStep1');

        const lengthOfStaySpan = document.getElementById('lengthOfStay');
        const arrivalDateReceipt = document.getElementById('arrivalDateReceipt');
        const departureDateReceipt = document.getElementById('departureDateReceipt');
        const roomsSummaryList = document.getElementById('roomsSummaryList');
        const totalPriceSpan = document.getElementById('totalPrice');

        let selectedRoomType = null;
        let selectedRoom = null;
        let selectedPrice = 0;
        let catsCount = 1;

        // Pomocné funkce
        function updateStepIndicator(currentStep) {
            stepsIndicators.forEach((el, i) => {
                el.classList.toggle('active', i === currentStep - 1);
            });
        }

        function updateRoomTypeButtonsState() {
            const ownersCount = parseInt(ownersSelect.value, 10);

            if (isNaN(ownersCount)) {
                // Pokud není vybrán počet majitelů, obě tlačítka deaktivuj
                catOnlyBtn.disabled = true;
                ownerAndCatBtn.disabled = true;
                selectedRoomType = null;
                catOnlyBtn.style.backgroundColor = '';
                ownerAndCatBtn.style.backgroundColor = '';
                updateSearchBtnState();
                return;
            }

            if (ownersCount > 0) {
                // Pokud je alespoň jeden majitel, deaktivuj "Pokoj pro kočku"
                catOnlyBtn.disabled = true;
                ownerAndCatBtn.disabled = false;

                // Pokud je aktuálně vybrán "Pokoj pro kočku", tak výběr zruš
                if (selectedRoomType === 'catOnly') {
                    selectedRoomType = null;
                    catOnlyBtn.style.backgroundColor = '';
                    updateSearchBtnState();
                }
            } else {
                // Pokud není vybrán žádný majitel (0), deaktivuj "Pokoj pro majitele a kočku"
                catOnlyBtn.disabled = false;
                ownerAndCatBtn.disabled = true;

                // Pokud byl vybrán "Pokoj pro majitele a kočku", zruš výběr
                if (selectedRoomType === 'ownerAndCat') {
                    selectedRoomType = null;
                    ownerAndCatBtn.style.backgroundColor = '';
                    updateSearchBtnState();
                }
            }
        }

// Zavolej hned po načtení i při změně ownersSelect
        ownersSelect.addEventListener('change', () => {
            updateRoomTypeButtonsState();
            updateSearchBtnState();
        });

// Inicializace stavu tlačítek
        updateRoomTypeButtonsState();

        function validateStep1Inputs() {
            // Podmínky:
            // Výběr typu pokoje musí být vybraný (selectedRoomType != null)
            // datum příjezdu a odjezdu musí být vyplněné a odjezd musí být po příjezdu
            // počet koček minimálně 1 (už je omezeno v selectu)
            if (!selectedRoomType) return false;

            if(!arrivalDateInput.value || !departureDateInput.value) return false;

            if(new Date(departureDateInput.value) <= new Date(arrivalDateInput.value)) return false;

            // Počet koček už je 1-5 povoleno, takže ok
            return true;
        }

        function filterRooms() {
            const roomArticles = roomsList.querySelectorAll('article.room');

            roomArticles.forEach(article => {
                if(article.dataset.roomtype === selectedRoomType) {
                    article.classList.remove('hidden');
                } else {
                    article.classList.add('hidden');
                }
            });
        }

        // Výběr typu pokoje
        [catOnlyBtn, ownerAndCatBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                selectedRoomType = btn.dataset.roomtype;

                // Vykreslit vizuální stav výběru
                [catOnlyBtn, ownerAndCatBtn].forEach(b => b.style.backgroundColor = '');
                btn.style.backgroundColor = '#add8e6';

                // Po výběru typu pokoje je možné povolit vyhledání, pokud ostatní podmínky jsou OK
                updateSearchBtnState();

                // Pokud už bylo vyhledáno, filtruj pokoje rovnou
                filterRooms();
            });
        });

        // Kontrola zda umožnit tlačítko vyhledat
        function updateSearchBtnState() {
            searchBtn.disabled = !validateStep1Inputs();
        }

        // Sleduj změny u dat a počtů hostů, aby se tlačítko vyhledat aktivovalo/deaktivovalo
        [arrivalDateInput, departureDateInput, catsSelect].forEach(el => {
            el.addEventListener('change', () => {
                catsCount = parseInt(catsSelect.value, 10);
                updateSearchBtnState();
            });
        });

        // Změna počtu majitelů pro případ rozšíření validace může být přidána

        // Tlačítko "Vyhledat"
        searchBtn.addEventListener('click', () => {
            filterRooms();
            roomsList.style.display = 'block';
            // Po vyhledání uživitelně nelze kliknout znovu bez změny vstupů - nechám povolené, aby mohl měnit výběr
        });

        // Klik na "Rezervovat" u pokoje - přejde na souhrn a zobrazí formuláře
        roomsList.addEventListener('click', e => {
            if(!e.target.classList.contains('reserveBtn')) return;

            const article = e.target.closest('article.room');
            selectedRoom = {
                name: article.querySelector('h4').textContent,
                price: parseInt(article.querySelector('p:nth-of-type(2)').textContent.replace(/\D+/g, '')) || 0
            };
            selectedPrice = selectedRoom.price;

            // Přepni krok
            step1.style.display = 'none';
            roomsList.style.display = 'none';
            step2.style.display = 'block';

            updateStepIndicator(2);

            // Vytvoř formuláře pro kočky podle počtu
            renderCatForms();

            // Zobraz účtenku
            renderReceipt();

            receipt.style.display = 'block';

            // Skryj potvrzení
            confirmation.style.display = 'none';

            // Scroll k topu (lepší UX)
            window.scrollTo(0, 0);
        });

        // Funkce pro generování formulářů koček podle počtu koček z výběru
        function renderCatForms() {
            catsCount = parseInt(catsSelect.value, 10);
            catsInfoFieldset.innerHTML = '<legend>Údaje koček</legend>';
            for(let i=1; i<=catsCount; i++) {
                const div = document.createElement('div');
                div.innerHTML = `
      <h4>Kočka ${i}</h4>
      <label for="catName${i}">Jméno: <span style="color:red">*</span></label>
      <input type="text" id="catName${i}" name="catName${i}" required />

      <label for="catAge${i}">Věk: <span style="color:red">*</span></label>
      <input type="number" id="catAge${i}" name="catAge${i}" min="0" required />

      <label for="catReq${i}">Speciální požadavky:</label>
      <textarea id="catReq${i}" name="catReq${i}" placeholder="Nepovinné"></textarea>
      <hr />
    `;
                catsInfoFieldset.appendChild(div);
            }
        }

        // Funkce pro výpočet délky pobytu a zobrazení v účtence
        function renderReceipt() {
            const arrivalDate = arrivalDateInput.value;
            const departureDate = departureDateInput.value;

            if(!arrivalDate || !departureDate) {
                lengthOfStaySpan.textContent = '___';
                arrivalDateReceipt.textContent = '___';
                departureDateReceipt.textContent = '___';
                roomsSummaryList.innerHTML = '';
                totalPriceSpan.textContent = '___';
                return;
            }

            const arrival = new Date(arrivalDate);
            const departure = new Date(departureDate);
            const diffTime = departure - arrival;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            lengthOfStaySpan.textContent = diffDays.toString();
            arrivalDateReceipt.textContent = arrival.toLocaleDateString('cs-CZ');
            departureDateReceipt.textContent = departure.toLocaleDateString('cs-CZ');

            roomsSummaryList.innerHTML = '';
            const liRoom = document.createElement('li');
            liRoom.textContent = `${selectedRoom.name}, Cena: ${selectedRoom.price} Kč`;
            roomsSummaryList.appendChild(liRoom);

            totalPriceSpan.textContent = selectedRoom.price;
        }

        // Tlačítko zpět na výběr pokojů
        backToStep1Btn.addEventListener('click', () => {
            step2.style.display = 'none';
            receipt.style.display = 'none';
            confirmation.style.display = 'none';
            step1.style.display = 'block';
            updateStepIndicator(1);

            // Vymaž vybraný pokoj, aby bylo jasné, že je potřeba vybrat znovu
            selectedRoom = null;
            selectedPrice = 0;

            // Reset formulář souhrnu
            summaryForm.reset();

            // Skryj účtenku
            receipt.style.display = 'none';

            window.scrollTo(0, 0);
        });

        // Odeslání formuláře rezervace
        summaryForm.addEventListener('submit', e => {
            e.preventDefault();

            // Přidej zde další validace, pokud chceš

            // Při úspěšném odeslání zobraz potvrzení
            step2.style.display = 'none';
            receipt.style.display = 'none';
            confirmation.style.display = 'block';

            updateStepIndicator(3);

            window.scrollTo(0, 0);
        });
    })();


// -----------------------------------------------------------------------------------------------------------------------
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // měsíce od 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    window.addEventListener('DOMContentLoaded', () => {
        const arrivalInput = document.getElementById('arrivalDate');   // odpovídá tvému html
        const departureInput = document.getElementById('departureDate');

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        arrivalInput.value = formatDate(today);
        departureInput.value = formatDate(tomorrow);

        arrivalInput.min = formatDate(today);
        departureInput.min = formatDate(tomorrow);

        // Pokud změníš příjezd, nastav min. odjezdu minimálně na den po příjezdu
        arrivalInput.addEventListener('change', () => {
            const arrivalDate = new Date(arrivalInput.value);
            const minDeparture = new Date(arrivalDate);
            minDeparture.setDate(arrivalDate.getDate() + 1);

            departureInput.min = formatDate(minDeparture);

            // Pokud je aktuální odjezd menší než nové minimum, uprav ho
            if (new Date(departureInput.value) <= arrivalDate) {
                departureInput.value = formatDate(minDeparture);
            }
        });
    });
});