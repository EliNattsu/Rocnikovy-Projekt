package cz.catparadise.controller;

import cz.catparadise.dto.LoginRequest;
import cz.catparadise.dto.RegistrationRequest;
import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import cz.catparadise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String register(@RequestBody RegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Uživatel s tímto e-mailem už existuje.";
        }

        // Ověření, že heslo není prázdné
        if (request.getPasswordHash() == null || request.getPasswordHash().isEmpty()) {
            return "Heslo nesmí být prázdné.";
        }

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPasswordHash()), // ukládáme hash
                request.getPhoneNumber(),
                LocalDateTime.now()
        );

        userService.saveUser(user);
        return "Registrace proběhla úspěšně.";
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
