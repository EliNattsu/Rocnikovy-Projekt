package cz.catparadise.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reservationId;

    @Column(name="start_date", nullable=false)
    private LocalDate startDate;

    @Column(name="end_date", nullable=false)
    private LocalDate endDate;

    @Column(name="status", nullable=false, length=10)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id2", nullable=false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"reservations", "cats", "passwordHash"})
    private User user;

    @ManyToMany
    @JoinTable(
            name = "Cat_Reservations",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "cat_id")
    )
    @JsonManagedReference
    private Set<Cat> cats = new HashSet<>();

    public Reservation() {}

    public Reservation(LocalDate startDate, LocalDate endDate, String status, User user) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.user = user;
    }

    // gettery a settery
    public Integer getReservationId() { return reservationId; }
    public void setReservationId(Integer reservationId) { this.reservationId = reservationId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Set<Cat> getCats() { return cats; }
    public void setCats(Set<Cat> cats) { this.cats = cats; }
}