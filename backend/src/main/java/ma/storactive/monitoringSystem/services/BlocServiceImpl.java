package ma.storactive.monitoringSystem.services;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.repositories.BlocRepository;
import ma.storactive.monitoringSystem.repositories.GenreRepository;

@Service
public class BlocServiceImpl implements BlocService {
	@Autowired
	BlocRepository blocRepository;
	GenreRepository genreRepository;

	@Override
	public Bloc createBloc(Bloc bloc) {
		System.out.println(bloc);
		return blocRepository.save(bloc);
	}

	@Override
	public String deleteBloc(long id) {
		Optional<Bloc> bloc = blocRepository.findById(id);
		if(bloc.isPresent()) {
			blocRepository.deleteById(id);
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
}
