package cz.catparadise.repository;

import cz.catparadise.model.Cat;
import cz.catparadise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatRepository extends JpaRepository<Cat, Integer> {
    List<Cat> findByUser(User user);
}