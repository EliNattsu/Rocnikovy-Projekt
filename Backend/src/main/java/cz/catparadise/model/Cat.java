package cz.catparadise.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Cats")
public class Cat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer catId;

    @Column(name="cat_name", nullable=false, length = 50)
    private String catName;

    @Column(name="age", nullable=false)
    private Integer age;

    @Column(name="notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable=false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"reservations", "cats", "passwordHash"})
    private User user;

    @ManyToMany(mappedBy = "cats")
    @JsonBackReference
    private Set<Reservation> reservations = new HashSet<>();

    public Cat() {}

    public Cat(String catName, Integer age, String notes, User user) {
        this.catName = catName;
        this.age = age;
        this.notes = notes;
        this.user = user;
    }

    // gettery a settery
    public Integer getCatId() { return catId; }
    public void setCatId(Integer catId) { this.catId = catId; }

    public String getCatName() { return catName; }
    public void setCatName(String catName) { this.catName = catName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Set<Reservation> getReservations() { return reservations; }
    public void setReservations(Set<Reservation> reservations) { this.reservations = reservations; }
}
