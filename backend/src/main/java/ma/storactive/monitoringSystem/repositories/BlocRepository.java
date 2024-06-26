package ma.storactive.monitoringSystem.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ma.storactive.monitoringSystem.entities.Bloc;

@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long>{
	@Query("SELECT b FROM Bloc b WHERE b.blocDate = :today")
	List<Bloc> getTodayBlocs(@Param("today") LocalDate today);
}
