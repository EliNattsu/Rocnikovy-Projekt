# Use Case Scénář  
## Název: Rezervace pokoje  

### Aktéři:  
- **Běžný uživatel** (není přihlášen)  
- **Registrovaný uživatel** (přihlášen)  
- **Backend API** (zpracování požadavků)  

---

### Hlavní tok (Success Flow)  
1. Uživatel na webu klikne na tlačítko **„Rezervace“**.  
2. Vybere typ pokoje.  
   - Pokud chce pokoj i pro majitele a kočku, musí nejdřív zadat počet majitelů.  
3. Zadá termín příjezdu a odjezdu.  
4. Zadá počet koček (vždy jedna, toto je ošetřeno pomocí JavaScriptu).  
5. Klikne na tlačítko **„Vyhledat“**.  
   - Frontend pomocí JavaScriptu podle vybraného typu pokoje zviditelní nebo skryje příslušné pokoje na stránce.  
6. Vybere si pokoj, který se mu líbí, a klikne na tlačítko **„Rezervovat“**.  
7. Vyplní požadované údaje o sobě a o kočkách:  
   - Běžný uživatel vyplní jméno, příjmení, e-mail a telefon.  
   - Registrovaný uživatel vidí údaje předvyplněné z profilu a může je upravit.  
8. (Volitelně) Běžný uživatel může zaškrtnout možnost **„Chci se zaregistrovat“**.  
   - Heslo mu přijde e-mailem a po přihlášení si ho musí změnit.  
9. Klikne na tlačítko **„Zarezervovat“**.  
10. **Frontend** odešle požadavek na backend pro uložení rezervace spolu s daty (včetně registrace, pokud byla zvolena).  
11. **Backend API:**  
    - Zpracuje data a ověří platnost termínu (např. kontrola, že datum není v minulosti).  
    - Pokud byla zvolena registrace, uloží data uživatele a kočiček do databáze s unikátními ID.  
    - Uloží rezervaci a přiřadí jí ID.  
    - Odešle uživateli potvrzovací e-mail s instrukcemi.  
    - Vrátí do frontendu informace o úspěšném uložení rezervace.  
12. **Frontend** zobrazí uživateli potvrzení rezervace s rekapitulací.  

---

### Alternativní toky  

**A1: Chybný formát datumu**  
- 3a. Backend zjistí, že pokoj/termín je obsazen.  
- 3b. Vrací odpověď 409 (Conflict) s hláškou „Vybraný termín není k dispozici“.  
- 3c. Frontend zobrazí chybovou hlášku a nabídne volné alternativní termíny.  

**A2: Chybný formát dat**  
- 11a. Backend při validaci najde chyby (např. chybně vyplněný e-mail, nevyplněný údaj o počtu koček).  
- 11b. Vrací odpověď 400 s informací o konkrétních chybách.  
- 11c. Frontend zobrazí chyby přímo u formulářových polí.  

**A3: Backend nedostupný**  
- 10a. Request nelze odeslat nebo backend vrací 500.  
- 10b. Frontend zobrazí hlášku: „Došlo k chybě při zpracování rezervace. Zkuste to prosím později.“  