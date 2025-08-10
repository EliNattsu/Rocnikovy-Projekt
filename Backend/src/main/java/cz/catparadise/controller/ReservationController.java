package cz.catparadise.controller;

import cz.catparadise.model.Reservation;
import cz.catparadise.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // ✅ Vytvoření rezervace
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    // ✅ Výpis všech rezervací
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // ✅ Detaily rezervace (lepší přes ResponseEntity)
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Integer id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Rezervace podle statusu
    @GetMapping("/status/{status}")
    public List<Reservation> getReservationsByStatus(@PathVariable String status) {
        return reservationService.getReservationsByStatus(status);
    }

    // ✅ Úprava statusu rezervace
    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Integer id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }

    // ✅ Úprava celé rezervace (např. datumů, stavu atd.)
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Integer id,
            @RequestBody Reservation updated
    ) {
        return reservationService.getReservationById(id).map(reservation -> {
            reservation.setStartDate(updated.getStartDate());
            reservation.setEndDate(updated.getEndDate());
            return ResponseEntity.ok(reservationService.saveReservation(reservation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Smazání rezervace
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Integer id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
