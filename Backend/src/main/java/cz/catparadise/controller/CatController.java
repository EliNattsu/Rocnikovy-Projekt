package cz.catparadise.controller;

import cz.catparadise.model.Cat;
import cz.catparadise.model.User;
import cz.catparadise.service.UserService;
import cz.catparadise.service.CatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cats")
public class CatController {

    private final CatService catService;
    private final UserService userService;

    @Autowired
    public CatController(CatService catService, UserService userService) {
        this.catService = catService;
        this.userService = userService;
    }

    // Přidat kočku
    @PostMapping
    public Cat createCat(@RequestBody Cat cat) {
        return catService.saveCat(cat);
    }

    // Vypsat všechny kočky
    @GetMapping
    public List<Cat> getAllCats() {
        return catService.getAllCats();
    }

    // Detail kočky podle ID
    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable Integer id) {
        return catService.getCatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Upravit kočku (jméno, věk, speciální potřeby)
    @PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable Integer id, @RequestBody Cat updated) {
        return catService.getCatById(id)
                .map(cat -> {
                    cat.setCatName(updated.getCatName());
                    cat.setAge(updated.getAge());
                    cat.setNotes(updated.getNotes());
                    return ResponseEntity.ok(catService.saveCat(cat));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Smazat kočku
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable Integer id) {
        catService.deleteCat(id);
        return ResponseEntity.noContent().build();
    }

    // Výpis koček podle uživatele
    @GetMapping("/by-user/{userId}")
    public List<Cat> getCatsByUser(@PathVariable Integer userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Uživatel s ID " + userId + " neexistuje."));
        return catService.getCatsByUser(user);
    }
}