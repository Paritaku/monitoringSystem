package ma.storactive.monitoringSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.storactive.monitoringSystem.entities.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

}
