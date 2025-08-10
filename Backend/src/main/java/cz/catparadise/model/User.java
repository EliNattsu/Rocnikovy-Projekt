package cz.catparadise.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(name="first_name", nullable=false, length = 50)
    private String firstName;

    @Column(name="last_name", nullable=false, length = 50)
    private String lastName;

    @Column(name="email", nullable=false, unique=true, length=100)
    private String email;

    @Column(name="password_hash", nullable=false, length=255)
    private String passwordHash;

    @Column(name="phone_number", nullable=false, unique=true, length=20)
    private String phoneNumber;

    @Column(name="registration_date", nullable=false)
    private LocalDateTime registrationDate;

    // Vztah na Cats – pozor na serializaci, abys neměla cyklickou chybu
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "user-cats")
    private Set<Cat> cats = new HashSet<>();

    // Vztah na Reservations
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "user-reservations")
    private Set<Reservation> reservations = new HashSet<>();

    public User() {}

    public User(String firstName, String lastName, String email, String passwordHash, String phoneNumber, LocalDateTime registrationDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
    }

    // --- Gettery a settery ---
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public Set<Cat> getCats() { return cats; }
    public void setCats(Set<Cat> cats) { this.cats = cats; }

    public Set<Reservation> getReservations() { return reservations; }
    public void setReservations(Set<Reservation> reservations) { this.reservations = reservations; }
}