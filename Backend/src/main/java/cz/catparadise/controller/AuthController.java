package cz.catparadise.controller;

import cz.catparadise.dto.LoginRequest;
import cz.catparadise.dto.RegistrationRequest;
import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import cz.catparadise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Registrace
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        String hashedPassword = null;
        if (request.getPasswordHash() != null && !request.getPasswordHash().isEmpty()) {
            hashedPassword = passwordEncoder.encode(request.getPasswordHash());
        }

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                hashedPassword,
                request.getPhoneNumber(),
                LocalDateTime.now()
        );

        try {
            User saved = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

    }

    // Login (jen ověření bez tokenu)
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return "Neplatné přihlašovací údaje.";
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPasswordHash(), user.getPasswordHash())) {
            return "Neplatné přihlašovací údaje.";
        }

        return "Přihlášení proběhlo úspěšně.";
    }
}