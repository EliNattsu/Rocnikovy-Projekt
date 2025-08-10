package cz.catparadise.service;

import cz.catparadise.model.Cat;
import cz.catparadise.model.User;
import cz.catparadise.repository.CatRepository;
import cz.catparadise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CatService {

    private final CatRepository catRepository;
    private final UserRepository userRepository;

    public CatService(CatRepository catRepository, UserRepository userRepository) {
        this.catRepository = catRepository;
        this.userRepository = userRepository;
    }

    public List<Cat> getCatsForUser(User user) {
        return catRepository.findByUser(user);
    }

    public Optional<Cat> getCatByIdForUser(Integer id, User user) {
        return catRepository.findById(id)
                .filter(cat -> cat.getUser().getUserId().equals(user.getUserId()));
    }

    public Cat createCatForUser(Cat cat, User user) {
        cat.setUser(user);
        return catRepository.save(cat);
    }

    public boolean deleteCatForUser(Integer id, User user) {
        Optional<Cat> catOpt = getCatByIdForUser(id, user);
        if (catOpt.isPresent()) {
            catRepository.delete(catOpt.get());
            return true;
        }
        return false;
    }
}
