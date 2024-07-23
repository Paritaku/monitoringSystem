package ma.storactive.monitoringSystem.services;

import java.io.Console;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.repositories.CouleeRepository;
import ma.storactive.monitoringSystem.repositories.BlocRepository;

@Service
public class BlocServiceImpl implements BlocService {
	@Autowired
	private BlocRepository blocRepository;
	@Autowired
	private SimpMessagingTemplate template;
	@Autowired
	private CouleeService couleeService;
	@Override
	public Bloc saveBloc(Bloc b) {
		Bloc saved = blocRepository.save(b);
		Long couleeId = saved.getCoulee().getId();
		if(saved.getCoulee().getDate().equals(LocalDate.now())) {
			template.convertAndSend("/topic/bloc/today/"+couleeId, getBlocsByCouleeId(couleeId));
		}	
		return saved;
	}

	@Override
	public List<Bloc> getAllBlocs() {
		return blocRepository.findAll();
	}

	@Override
	public List<Bloc> getTodayBlocs() {
		LocalDate today = LocalDate.now();
		return blocRepository.getTodayBlocs(today);
	}

	@Override
	public long getLastId() {
		Optional<Bloc> p = blocRepository.getLastBlocSaved();
		if(p.isPresent()) {
			return p.get().getId();
		}
		return 0;
	}

	@Override
	public void deleteBloc(Long id) {
		Optional<Bloc> p = blocRepository.findById(id);
		blocRepository.deleteById(id);
		if(p.isPresent() && p.get().getCoulee().getDate().equals(LocalDate.now())) {
			template.convertAndSend("/topic/produit/today",getTodayBlocs());
			template.convertAndSend("/topic/bloc/today", couleeService.getTodayCoulees());
		} 
	}

	@Override
	public List<Bloc> getBlocsByCouleeId(Long id) {
		return blocRepository.findByCouleeId(id);
	}
	
}
