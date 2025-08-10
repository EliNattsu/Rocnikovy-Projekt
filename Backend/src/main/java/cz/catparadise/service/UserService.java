package cz.catparadise.service;

import cz.catparadise.model.User;
import cz.catparadise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean existsById(Integer userId) {
        return userRepository.existsById(userId);
    }

    // Uložení nového uživatele
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Výpis všech uživatelů
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Najdi podle ID
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Smazání podle ID
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}