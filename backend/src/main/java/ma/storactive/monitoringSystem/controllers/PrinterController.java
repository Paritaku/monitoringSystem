package ma.storactive.monitoringSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.storactive.monitoringSystem.services.PrinterService;

@RestController
@RequestMapping("/api/v1/printer/")
public class PrinterController {
	@Autowired
	PrinterService printerService;
	
	@GetMapping("statut")
	public boolean getPrinterConnectionStatut() {
		return printerService.isConnected();
	}
	
	@PostMapping("sendlastproduct")
	public void sendLastProduct(){
		printerService.sendLastMesureToPrinter();
	}
}
