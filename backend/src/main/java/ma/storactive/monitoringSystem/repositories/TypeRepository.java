package ma.storactive.monitoringSystem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.storactive.monitoringSystem.entities.Type;

@Repository
public interface TypeRepository extends JpaRepository<Type, Long> {
	Optional<Type> findByIntitule(String string);
}
