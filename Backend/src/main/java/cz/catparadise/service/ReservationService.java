package cz.catparadise.service;

import cz.catparadise.model.Cat;
import cz.catparadise.model.Reservation;
import cz.catparadise.model.User;
import cz.catparadise.repository.CatRepository;
import cz.catparadise.repository.ReservationRepository;
import cz.catparadise.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;
import java.util.Base64;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final CatRepository catRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // <<< přidaný constructor s UserRepository, PasswordEncoder, EmailService
    public ReservationService(
            ReservationRepository reservationRepository,
            CatRepository catRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.reservationRepository = reservationRepository;
        this.catRepository = catRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Vytvoření rezervace + případná registrace
     * @param email email uživatele
     * @param registrationData údaje pro registraci (jméno, příjmení, tel)
     * @param startDate
     * @param endDate
     * @param catData seznam koček (každá má jméno, věk, poznámka)
     * @param registerNow zda registrovat uživatele
     */
    public Reservation createReservationWithRegistration(
            String email,
            Map<String, String> registrationData,
            LocalDate startDate,
            LocalDate endDate,
            List<Map<String, Object>> catData,
            boolean registerNow
    ) throws MessagingException {

        User user = userRepository.findByEmail(email).orElse(null);
        String generatedPassword = null;
        if (user == null && registerNow && registrationData != null) {
            generatedPassword = generatePassword();
            user = new User(
                    registrationData.get("firstName"),
                    registrationData.get("lastName"),
                    email,
                    passwordEncoder.encode(generatedPassword),
                    registrationData.get("phoneNumber"),
                    LocalDate.now().atStartOfDay()
            );
            user = userRepository.save(user);
            // Poslat heslo na mail
            emailService.sendEmail(
                    email,
                    "Vaše registrace u CatParadise",
                    "<p>Děkujeme za registraci.<br>Vaše počáteční heslo: <b>" + generatedPassword + "</b><br>Můžete si ho změnit v profilu.<br><br>Přihlaste se <a href='http://localhost:3000/login'>zde</a>.<br></p>"
            );
        }

        // Kočky se uloží k uživateli
        Set<Cat> cats = new HashSet<>();
        for (Map<String, Object> catMap : catData) {
            String catName = (String) catMap.get("catName");
            Integer age = Integer.valueOf(catMap.get("age").toString());
            String notes = (String) catMap.getOrDefault("notes", "");
            Cat cat = new Cat(catName, age, notes, user);
            cats.add(catRepository.save(cat));
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setStatus("pending");
        reservation.setCats(cats);
        reservation = reservationRepository.save(reservation);

        // Poslat potvrzení rezervace
        emailService.sendEmail(
                email,
                "Potvrzení rezervace u CatParadise",
                "<p>Děkujeme za rezervaci.<br>Termín: <b>" + startDate + " - " + endDate + "</b></p>"
        );
        return reservation;
    }

    private String generatePassword() {
        byte[] randomBytes = new byte[12];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    // --- Zbytek původních metod zůstává ---

    public Reservation createReservation(User user, LocalDate startDate, LocalDate endDate, Set<Integer> catIds) {
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setStatus("pending");

        Set<Cat> cats = catIds.stream()
                .map(catRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(cat -> cat.getUser().getUserId().equals(user.getUserId()))
                .collect(java.util.stream.Collectors.toSet());

        reservation.setCats(cats);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(User user) {
        return reservationRepository.findByUser(user);
    }

    public Optional<Reservation> getReservationByIdAndUser(Integer id, User user) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent() && reservation.get().getUser().getUserId().equals(user.getUserId())) {
            return reservation;
        }
        return Optional.empty();
    }

    public Reservation updateReservationStatus(Integer reservationId, User user, String status) {
        Optional<Reservation> reservationOpt = getReservationByIdAndUser(reservationId, user);
        if(reservationOpt.isEmpty()) {
            throw new RuntimeException("Reservation not found or access denied");
        }

        Reservation reservation = reservationOpt.get();
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservationDates(Integer reservationId, User user, LocalDate startDate, LocalDate endDate) {
        Optional<Reservation> reservationOpt = getReservationByIdAndUser(reservationId, user);
        if(reservationOpt.isEmpty()) {
            throw new RuntimeException("Reservation not found or access denied");
        }

        Reservation reservation = reservationOpt.get();
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        return reservationRepository.save(reservation);
    }
}