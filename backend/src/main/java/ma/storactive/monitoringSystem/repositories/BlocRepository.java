package ma.storactive.monitoringSystem.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ma.storactive.monitoringSystem.entities.Bloc;

public interface BlocRepository extends JpaRepository<Bloc, Long> {
	@Query("SELECT b FROM Bloc b WHERE b.coulee.date = :today ORDER BY b.id DESC")
	List<Bloc> getTodayBlocs(@Param("today") LocalDate today);	
	
	@Query("SELECT p FROM Bloc p WHERE p.id = (SELECT MAX(p2.id) FROM Bloc p2)")
	Optional<Bloc> getLastBlocSaved();
	
	@Query("SELECT b FROM Bloc b WHERE b.coulee.id = :couleeId")
	List<Bloc> getBlocsByCoulee(@Param("couleeId") long id);

	List<Bloc> findByCouleeId(Long id);
}
