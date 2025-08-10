package cz.catparadise.controller;

import cz.catparadise.model.Reservation;
import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import cz.catparadise.security.JwtUtil;
import cz.catparadise.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ReservationController(ReservationService reservationService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    private User getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) return null;
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }

    // Vytvoření nové rezervace (pro uživatele s tokenem)
    @PostMapping
    public ResponseEntity<?> createReservation(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        User user = getUserFromToken(request);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nejste přihlášen");

        try {
            LocalDate startDate = LocalDate.parse(body.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(body.get("endDate").toString());
            @SuppressWarnings("unchecked")
            Set<Integer> catIds = new HashSet<>((List<Integer>) body.get("catIds"));

            Reservation reservation = reservationService.createReservation(user, startDate, endDate, catIds);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Neplatná data: " + e.getMessage());
        }
    }

    // Seznam rezervací uživatele
    @GetMapping
    public ResponseEntity<?> getMyReservations(HttpServletRequest request) {
        User user = getUserFromToken(request);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nejste přihlášen");

        List<Reservation> reservations = reservationService.getUserReservations(user);
        return ResponseEntity.ok(reservations);
    }

    // Změna stavu rezervace
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(HttpServletRequest request, @PathVariable Integer id, @RequestParam String status) {
        User user = getUserFromToken(request);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nejste přihlášen");

        if(!Set.of("pending", "confirmed", "cancelled").contains(status)) {
            return ResponseEntity.badRequest().body("Neplatný status");
        }

        try {
            Reservation updated = reservationService.updateReservationStatus(id, user, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Úprava termínu rezervace
    @PutMapping("/{id}/dates")
    public ResponseEntity<?> updateDates(HttpServletRequest request, @PathVariable Integer id, @RequestBody Map<String, String> dates) {
        User user = getUserFromToken(request);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nejste přihlášen");

        try {
            LocalDate startDate = LocalDate.parse(dates.get("startDate"));
            LocalDate endDate = LocalDate.parse(dates.get("endDate"));
            Reservation updated = reservationService.updateReservationDates(id, user, startDate, endDate);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Neplatná data: " + e.getMessage());
        }
    }

    // Vytvoření rezervace + případná registrace uživatele
    @PostMapping("/create")
    public ResponseEntity<?> createReservationWithRegistration(@RequestBody Map<String, Object> body) {
        try {
            String email = body.get("email").toString();
            boolean registerNow = body.get("registerNow") != null && Boolean.parseBoolean(body.get("registerNow").toString());
            Map<String, String> registrationData = registerNow && body.get("registrationData") != null
                    ? (Map<String, String>) body.get("registrationData")
                    : null;
            LocalDate startDate = LocalDate.parse(body.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(body.get("endDate").toString());
            List<Map<String, Object>> catData = (List<Map<String, Object>>) body.get("cats");

            Reservation reservation = reservationService.createReservationWithRegistration(
                    email, registrationData, startDate, endDate, catData, registerNow
            );
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Neplatná data: " + e.getMessage());
        }
    }

    // DETAIL rezervace
    @GetMapping("/{id}")
    public ResponseEntity<Object> getReservationDetail(HttpServletRequest request, @PathVariable Integer id) {
        User user = getUserFromToken(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nejste přihlášen");
        }

        return reservationService.getReservationByIdAndUser(id, user)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Rezervace nenalezena nebo k ní nemáte přístup"));
    }
}
