package cz.catparadise.repository;

import cz.catparadise.model.Reservation;
import cz.catparadise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUser(User user);
    List<Reservation> findByStatus(String status);
}