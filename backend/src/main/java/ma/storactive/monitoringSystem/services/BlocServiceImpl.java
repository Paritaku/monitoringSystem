package ma.storactive.monitoringSystem.services;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties.Lettuce.Cluster.Refresh;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.repositories.BlocRepository;
import ma.storactive.monitoringSystem.repositories.GenreRepository;
import ma.storactive.monitoringSystem.repositories.ProduitRepository;

@Service
public class BlocServiceImpl implements BlocService {
	@Autowired
	BlocRepository blocRepository;
	@Autowired
	GenreRepository genreRepository;
	@Autowired
	ProduitService produitService;
	@Autowired
	SimpMessagingTemplate template;

	@Override
	public Bloc createBloc(Bloc bloc) {
		// System.out.println(bloc);
		//Actualisation de today bloc pour l'UI
		Bloc response = blocRepository.save(bloc);
		refreshTodayBloc(response);
		return response;
	}

	@Override
	public String deleteBloc(long id) {
		Optional<Bloc> bloc = blocRepository.findById(id);
		if(bloc.isPresent()) {
			blocRepository.deleteById(id);
			//Actualisation de today bloc pour l'UI
			refreshTodayBloc(bloc.get());
			return bloc.get().getBlocName() + " de type " + bloc.get().getGenre().getIntitule() + "supprimé";
		}
		return "Bloc not found";
	}

	@Override
	public List<Bloc> getAllBloc() {
		return blocRepository.findAll();
	}

	@Override
	public List<Bloc> getTodayBloc() {
		LocalDate today = LocalDate.now();
		System.out.println(today);
		List<Bloc> blocs = blocRepository.getTodayBlocs(today);
		return blocs.stream()
				.sorted((b1,b2) -> compareBlocStatut(b1.getBlocStatut(), b2.getBlocStatut()))
				.collect(Collectors.toList());
	}
	
	private int compareBlocStatut(String statut1, String statut2) {
	    List<String> order = Arrays.asList("EN COURS", "INITIALISE", "TERMINE");
	    return Integer.compare(order.indexOf(statut1), order.indexOf(statut2));
	}
	
	public void refreshTodayBloc(Bloc b) {
		if(b.getBlocDate().equals(LocalDate.now())) {
			System.out.println("On entre");
			template.convertAndSend("/topic/bloc/today", getTodayBloc());
			template.convertAndSend("/topic/produit/today", produitService.getTodayProduit());
		}
	}
}
