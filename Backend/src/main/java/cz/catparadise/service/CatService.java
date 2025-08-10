package cz.catparadise.service;

import cz.catparadise.model.Cat;
import cz.catparadise.model.User;
import cz.catparadise.repository.CatRepository;
import cz.catparadise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CatService {

    private final CatRepository catRepository;
    private final UserRepository userRepository;

    @Autowired
    public CatService(CatRepository catRepository, UserRepository userRepository) {
        this.catRepository = catRepository;
        this.userRepository = userRepository;
    }

    public Cat saveCat(Cat cat) {
        if (cat.getUser() == null || !userRepository.existsById(cat.getUser().getUserId())) {
            throw new IllegalArgumentException("Uživatel (majitel kočky) musí existovat.");
        }
        return catRepository.save(cat);
    }

    public List<Cat> getAllCats() {
        return catRepository.findAll();
    }

    public Optional<Cat> getCatById(Integer id) {
        return catRepository.findById(id);
    }

    public void deleteCat(Integer id) {
        catRepository.deleteById(id);
    }

    // výpis koček podle uživatele
    public List<Cat> getCatsByUser(User user) {
        return catRepository.findByUser(user);
    }
}