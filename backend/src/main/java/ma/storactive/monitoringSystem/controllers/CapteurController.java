package ma.storactive.monitoringSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.NoArgsConstructor;
import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.services.CapteursService;

@RestController
@RequestMapping("/api/v1/capteur/")
public class CapteurController {
	@Autowired
	CapteursService capteursService;
	
	@GetMapping("connect")
	public boolean isConnected() {
		return capteursService.isConnected();
	}
	
	@GetMapping("valeurs")
	public Bloc getCapteursValues() {
		return capteursService.getCapteursValues();
	}
	
	@GetMapping("validation")
	public int getValidation() {
		return capteursService.validation();
	}
}
