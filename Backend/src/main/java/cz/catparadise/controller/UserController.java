package cz.catparadise.controller;

import cz.catparadise.model.User;
import cz.catparadise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Přidání nového uživatele (POST /api/users)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Výpis všech uživatelů (GET /api/users)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Najdi uživatele podle ID (GET /api/users/{id})
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    // Smazání uživatele podle ID (DELETE /api/users/{id})
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Integer id,
            @RequestBody User updatedUser
    ) {
        return userService.getUserById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
}