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
@RequestMapping("/api/v1/bloc/")
public class BlocController {
	@Autowired
	BlocService blocService;
	
	@PostMapping("create")
	public Bloc createBloc(@RequestBody Bloc bloc) {
		return blocService.createBloc(bloc);
	}
	
	@DeleteMapping("delete/{id}")
	public String deleteBloc(@PathVariable long id){
		return blocService.deleteBloc(id);
	}
	
	@GetMapping("getAll")
	public List<Bloc> getAll(){
		return blocService.getAllBloc(); 
	}
	@GetMapping("getTodayBloc")
	public List<Bloc> getTodayBloc(){
		return blocService.getTodayBloc();
	}
}
