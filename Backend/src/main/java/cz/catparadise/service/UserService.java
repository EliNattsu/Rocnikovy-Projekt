package cz.catparadise.service;

import cz.catparadise.dto.LoginRequest;
import cz.catparadise.dto.RegistrationRequest;
import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Registrace uživatele
    public User registerUser(RegistrationRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email už existuje");
        }
        if(userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Telefon už existuje");
        }

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),  // HASH hesla
                request.getPhoneNumber(),
                LocalDateTime.now()
        );

        return userRepository.save(user);
    }

    // Přihlášení (vrátí uživatele při správném hesle)
    public User loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Špatné heslo");
        }
        return user; // tady v budoucnu vrátíme token (JWT)
    }

    // Změna hesla
    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Původní heslo není správné");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}