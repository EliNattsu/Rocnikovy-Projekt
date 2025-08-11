package cz.catparadise.service;

import cz.catparadise.model.Cat;
import cz.catparadise.model.Reservation;
import cz.catparadise.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation saveReservation(Reservation reservation) {
        reservation.setReferenceNumber("RES-" + UUID.randomUUID().toString().substring(0, 8));
        reservation.setStatus("pending");
        return reservationRepository.save(reservation);
    }

    // Vrátí všechny rezervace
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Najde rezervaci podle ID
    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findById(id);
    }

    // Smazání rezervace
    public void deleteReservation(Integer id) {
        reservationRepository.deleteById(id);
    }

    // Rezervace podle statusu
    public List<Reservation> getReservationsByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }

    public List<Reservation> getReservationsByUser(Integer userId) {
        return reservationRepository.findByUserUserId(userId);
    }

    // Změna stavu rezervace
    public Reservation updateReservationStatus(Integer id, String newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rezervace nenalezena: " + id));
        reservation.setStatus(newStatus);
        return reservationRepository.save(reservation);
    }
   public Reservation addCatToReservation(Integer reservationId, Integer catId, CatService catService) {
       Reservation reservation = reservationRepository.findById(reservationId)
               .orElseThrow(() -> new RuntimeException("Rezervace nenalezena: " + reservationId));
       
       Cat cat = catService.getCatById(catId)
               .orElseThrow(() -> new RuntimeException("Kočka nenalezena: " + catId));
       
       reservation.getCats().add(cat);
       return reservationRepository.save(reservation);
   }
}
