package cz.catparadise.controller;

import cz.catparadise.model.Cat;
import cz.catparadise.model.User;
import cz.catparadise.repository.CatRepository;
import cz.catparadise.repository.UserRepository;
import cz.catparadise.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cats")
@CrossOrigin(origins = "*")
public class CatController {

    private final CatRepository catRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CatController(CatRepository catRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.catRepository = catRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Cat> getMyCats(HttpServletRequest request) {
        User user = getUserFromToken(request);
        if (user == null) throw new RuntimeException("Není přihlášen");
        return catRepository.findByUser(user);
    }

    @PostMapping
    public Cat addCat(HttpServletRequest request, @RequestBody Cat cat) {
        User user = getUserFromToken(request);
        if (user == null) throw new RuntimeException("Není přihlášen");
        cat.setUser(user);
        return catRepository.save(cat);
    }

    @PutMapping("/{catId}")
    public Cat updateCat(HttpServletRequest request, @PathVariable Integer catId, @RequestBody Cat updatedCat) {
        User user = getUserFromToken(request);
        if (user == null) throw new RuntimeException("Není přihlášen");

        Optional<Cat> catOpt = catRepository.findById(catId);
        if (catOpt.isEmpty() || !catOpt.get().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Kočka nenalezena nebo k ní nemáš přístup");
        }

        Cat cat = catOpt.get();
        cat.setCatName(updatedCat.getCatName());
        cat.setAge(updatedCat.getAge());
        cat.setNotes(updatedCat.getNotes());

        return catRepository.save(cat);
    }

    @DeleteMapping("/{catId}")
    public String deleteCat(HttpServletRequest request, @PathVariable Integer catId) {
        User user = getUserFromToken(request);
        if (user == null) throw new RuntimeException("Není přihlášen");

        Optional<Cat> catOpt = catRepository.findById(catId);
        if (catOpt.isEmpty() || !catOpt.get().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Kočka nenalezena nebo k ní nemáš přístup");
        }

        catRepository.delete(catOpt.get());
        return "Kočka byla úspěšně smazána";
    }

    private User getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) return null;
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }
}
