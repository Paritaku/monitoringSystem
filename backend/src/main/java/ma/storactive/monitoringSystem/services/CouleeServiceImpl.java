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

import ma.storactive.monitoringSystem.entities.Coulee;
import ma.storactive.monitoringSystem.repositories.CouleeRepository;
import ma.storactive.monitoringSystem.repositories.TypeRepository;
import ma.storactive.monitoringSystem.repositories.BlocRepository;

@Service
public class CouleeServiceImpl implements CouleeService {
	@Autowired
	CouleeRepository couleeRepository;
	@Autowired
	TypeRepository typeRepository;
	@Autowired
	BlocService blocService;
	@Autowired
	SimpMessagingTemplate template;

	@Override
	public Coulee saveCoulee(Coulee coulee) {
		//Actualisation de today bloc pour l'UI
		Coulee response = couleeRepository.save(coulee);
		refreshTodayCoulee(response);
		return response;
	}

	@Override
	public String deleteCoulee(long id) {
		Optional<Coulee> coulee = couleeRepository.findById(id);
		if(coulee.isPresent()) {
			couleeRepository.deleteById(id);
			//Actualisation de today bloc pour l'UI
			refreshTodayCoulee(coulee.get());
			return "Id:" + coulee.get().getId() + " de type " + coulee.get().getType().getIntitule() + "supprimé";
		}
		return "Coulee not found";
	}
	
	@Override
	public List<Coulee> getAllCoulees() {
		return couleeRepository.findAll();
	}

	@Override
	public List<Coulee> getTodayCoulees() {
		LocalDate today = LocalDate.now();
		List<Coulee> coulees = couleeRepository.getCouleesPerDate(today);
		return coulees.stream()
				.sorted((c1,c2) -> compareBlocStatut(c1.getStatut(), c2.getStatut()))
				.collect(Collectors.toList());
	}

	private int compareBlocStatut(String statut1, String statut2) {
	    List<String> order = Arrays.asList("EN COURS", "EN ATTENTE", "TERMINE");
	    return Integer.compare(order.indexOf(statut1), order.indexOf(statut2));
	}
	
	public void refreshTodayCoulee(Coulee b) {
		if(b.getDate().equals(LocalDate.now())) {
			template.convertAndSend("/topic/coulee/today", getTodayCoulees());
			/*template.convertAndSend("/topic/bloc/today", blocService.getTodayBlocs());*/
		}
	}

	@Override
	public Long getNextNumCoulee() {
		Long response = couleeRepository.getLastNumCoulee();
		if(response == null)
			return 1L;
		else
			return (response+1);
		
	}
	@Override
	public Coulee getCouleeEnCours() {
		Optional<Coulee> couleeEnCours = couleeRepository.findByStatut("EN COURS");
		if(couleeEnCours.isPresent())
			return couleeEnCours.get();
		return null;
	}

	@Override
	public List<LocalDate> getDateList() {
		return couleeRepository.getDateList();
	}

	@Override
	public List<Coulee> getCouleesPerDate(LocalDate date) {
		return couleeRepository.getCouleesPerDate(date);
	}
}
