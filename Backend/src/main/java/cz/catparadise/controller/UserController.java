package cz.catparadise.controller;

import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import cz.catparadise.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/me")
    public User getCurrentUser(HttpServletRequest request) {
        User user = getCurrentUserFromToken(request);
        if (user == null) {
            throw new RuntimeException("Není přihlášen");
        }
        return user;
    }

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        // Hashování hesla
        newUser.setPasswordHash(passwordEncoder.encode(newUser.getPasswordHash()));
        return userRepository.save(newUser);
    }

    @PutMapping("/me")
    public User updateUser(HttpServletRequest request, @RequestBody User updatedUser) {
        User user = getCurrentUserFromToken(request);
        if (user == null) {
            throw new RuntimeException("Není přihlášen");
        }
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        return userRepository.save(user);
    }

    @PutMapping("/me/password")
    public String changePassword(HttpServletRequest request,
                                 @RequestParam String oldPassword,
                                 @RequestParam String newPassword) {
        User user = getCurrentUserFromToken(request);
        if (user == null) {
            return "Není přihlášen";
        }
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            return "Původní heslo se neshoduje!";
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Heslo bylo úspěšně změněno";
    }

    private User getCurrentUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return null;
        }
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }
}
