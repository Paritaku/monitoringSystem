package ma.storactive.monitoringSystem.services;

import java.util.List;

import ma.storactive.monitoringSystem.entities.Produit;

public interface ProduitService {
	Produit saveProduct(Produit p);

	List<Produit> getAllProduit();

	List<Produit> getTodayProduit();

	long getLastId();

	void deleteProduit(Long id);
}
