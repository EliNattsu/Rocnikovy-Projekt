package cz.catparadise.repository;

import cz.catparadise.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByStatus(String status);
    List<Reservation> findByUserUserId(Integer userId);
}