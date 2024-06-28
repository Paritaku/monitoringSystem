package ma.storactive.monitoringSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Produit;

@Service
public class ScheduledSensorsDataFetcherImpl implements ScheduledSensorsDataFetecher {
	@Autowired
	private CapteursService capteursService;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	
	@Scheduled(fixedRate = 1000000)
	@Override
	public void fetchData() {
		Produit p = capteursService.getCapteursValues();
		int validation = capteursService.validation();
		if(p != null ) {
			System.out.println(p);
			template.convertAndSend("/topic/data", p);
			template.convertAndSend("/topic/validation", validation);
		}
	}
}
