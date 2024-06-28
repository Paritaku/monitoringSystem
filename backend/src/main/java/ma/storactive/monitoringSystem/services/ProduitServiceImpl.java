package ma.storactive.monitoringSystem.services;

import java.io.Console;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Produit;
import ma.storactive.monitoringSystem.repositories.ProduitRepository;

@Service
public class ProduitServiceImpl implements ProduitService {
	@Autowired
	private ProduitRepository produitRepository;
	@Autowired 
	private SimpMessagingTemplate template;
	
	@Override
	public Produit saveProduct(Produit p) {
		Produit saved = produitRepository.save(p);
		if(saved.getBloc().getBlocDate().equals(LocalDate.now())) {
			System.out.println(getTodayProduit());
			template.convertAndSend("/topic/produit/today",getTodayProduit());
		}	
		return saved;
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
