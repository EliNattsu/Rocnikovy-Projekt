async function nactiProfil() {
    try {
        const profil = await apiRequest("/user/me", "GET", null, true); // true = s tokenem
        profil.phoneNumber = undefined;
        document.getElementById("profil").innerHTML = `
            <p>Jméno: ${profil.firstName} ${profil.lastName}</p>
            <p>Email: ${profil.email}</p>
            <p>Telefon: ${profil.phoneNumber}</p>
        `;
    } catch (err) {
        alert("Musíš být přihlášen!");
        window.location.href = "login.html";
    }
}

nactiProfil();