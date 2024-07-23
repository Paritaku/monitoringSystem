package ma.storactive.monitoringSystem.controllers;

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

import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.services.BlocService;


@RestController
@RequestMapping("api/v1/bloc/")
public class BlocController {
	@Autowired
	BlocService blocService;
	
	@PostMapping("save")
	public Bloc saveProduct(@RequestBody Bloc p) {
		return blocService.saveBloc(p);
	}
	@GetMapping("getAllProduit")
	public List<Bloc> getProduit(){
		return blocService.getAllBlocs();
	}
	@GetMapping("getTodayProduct")
	public List<Bloc> getTodayProduit(){
		return blocService.getTodayBlocs();
	}
	@GetMapping("getLastId")
	public long getLastId(){
		return blocService.getLastId();
	}
	@DeleteMapping("delete/{id}")
	public void deleteProduit(@PathVariable Long id) {
		blocService.deleteBloc(id);
	}
	@GetMapping("getBlocsByCouleeId/{id}")
	public List<Bloc> getBlocsByCouleeId(@PathVariable Long id) {
		return blocService.getBlocsByCouleeId(id);
	}
}
