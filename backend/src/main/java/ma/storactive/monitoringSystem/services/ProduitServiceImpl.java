package ma.storactive.monitoringSystem.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Produit;
import ma.storactive.monitoringSystem.repositories.ProduitRepository;

@Service
public class ProduitServiceImpl implements ProduitService {
	@Autowired
	private ProduitRepository produitRepository;
	
	@Override
	public Produit saveProduct(Produit p) {
		return produitRepository.save(p);
	}

	@Override
	public List<Produit> getAllProduit() {
		return produitRepository.findAll();
	}

	@Override
	public List<Produit> getTodayProduit() {
		LocalDate today = LocalDate.now();
		return produitRepository.getTodayProduit(today);
	}
}
