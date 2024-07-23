package ma.storactive.monitoringSystem.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.storactive.monitoringSystem.entities.Coulee;
import ma.storactive.monitoringSystem.services.CouleeService;

@RestController
@RequestMapping("/api/v1/coulee/")
public class CouleeController {
	@Autowired
	CouleeService couleeService;

	@PostMapping("save")
	public Coulee createCoulee(@RequestBody Coulee coulee) {
		return couleeService.saveCoulee(coulee);
	}
	
	@DeleteMapping("delete/{id}")
	public String deleteCoulee(@PathVariable long id){
		return couleeService.deleteCoulee(id);
	}
	
	@GetMapping("getAll")
	public List<Coulee> getAll(){
		return couleeService.getAllCoulees(); 
	}
	@GetMapping("getTodayCoulee")
	public List<Coulee> getTodayCoulees(){
		return couleeService.getTodayCoulees();
	}
	@GetMapping("getNextNumCoulee")
	public Long getLastNumCoulee() {
		return couleeService.getNextNumCoulee();
	}
	@GetMapping("getCouleeEnCours")
	public Coulee getCouleeEnCours() {
		return couleeService.getCouleeEnCours();
	}
	@GetMapping("getDateList")
	public List<LocalDate> getDateList() {
		return couleeService.getDateList();
	}
	@GetMapping("getCouleesPerDate/{date}") 
	public List<Coulee> getCouleesPerDate(@PathVariable LocalDate date) {
		return couleeService.getCouleesPerDate(date);
	}
}
