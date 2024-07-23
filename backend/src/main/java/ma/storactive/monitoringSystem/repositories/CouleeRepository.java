package ma.storactive.monitoringSystem.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ma.storactive.monitoringSystem.entities.Coulee;

@Repository
public interface CouleeRepository extends JpaRepository<Coulee, Long>{
	@Query("SELECT c FROM Coulee c WHERE c.date = :date")
	List<Coulee> getCouleesPerDate(@Param("date") LocalDate today);
	
	@Query("SELECT MAX(numero) FROM Coulee c")
	Long getLastNumCoulee();

	Optional<Coulee> findByStatut(String string);

	@Query("SELECT date FROM Coulee c GROUP BY c.date ORDER BY c.date DESC")
	List<LocalDate> getDateList();
}
