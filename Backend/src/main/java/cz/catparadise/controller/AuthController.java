package cz.catparadise.controller;

import cz.catparadise.dto.LoginRequest;
import cz.catparadise.security.JwtUtil;
import cz.catparadise.dto.RegistrationRequest;
import cz.catparadise.model.User;
import cz.catparadise.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService) {
        this.userService = userService;
        this.jwtUtil = new JwtUtil();
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.loginUser(request);
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
    }

    @PutMapping("/change-password/{userId}")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword
    ) {
        userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok("Heslo úspěšně změněno");
    }
}