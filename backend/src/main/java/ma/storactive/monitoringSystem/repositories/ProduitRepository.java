package ma.storactive.monitoringSystem.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ma.storactive.monitoringSystem.entities.Produit;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
	@Query("SELECT p FROM Produit p WHERE p.bloc.blocDate = :today ORDER BY p.id DESC")
	List<Produit> getTodayProduit(@Param("today") LocalDate today);	
	
	@Query("SELECT p FROM Produit p WHERE p.id = (SELECT MAX(p2.id) FROM Produit p2)")
	Optional<Produit> getLastProductSaved();
}
