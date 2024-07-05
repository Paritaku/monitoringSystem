package ma.storactive.monitoringSystem.services;

import java.io.Console;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import ma.storactive.monitoringSystem.entities.Produit;
import ma.storactive.monitoringSystem.repositories.BlocRepository;
import ma.storactive.monitoringSystem.repositories.ProduitRepository;

@Service
public class ProduitServiceImpl implements ProduitService {
	@Autowired
	private ProduitRepository produitRepository;
	@Autowired 
	private SimpMessagingTemplate template;
	@Autowired
	private BlocService blocService;
	
	@Override
	@Transactional
	public Produit saveProduct(Produit p) {
		System.out.println("Got from react:" + p);
		Produit saved = produitRepository.save(p);
		System.out.println("Saved in database:" + saved);
		if(saved.getBloc().getBlocDate().equals(LocalDate.now())) {
			template.convertAndSend("/topic/produit/today",getTodayProduit());
			template.convertAndSend("/topic/bloc/today", blocService.getTodayBloc());
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

	@Override
	public long getLastId() {
		Optional<Produit> p = produitRepository.getLastProductSaved();
		if(p.isPresent()) {
			return p.get().getId();
		}
		return 0;
	}

	@Override
	public void deleteProduit(Long id) {
		Optional<Produit> p = produitRepository.findById(id);
		produitRepository.deleteById(id);
		if(p.isPresent() && p.get().getBloc().getBlocDate().equals(LocalDate.now())) {
			template.convertAndSend("/topic/produit/today",getTodayProduit());
			template.convertAndSend("/topic/bloc/today", blocService.getTodayBloc());
		} 
		
		
	}
	
}
