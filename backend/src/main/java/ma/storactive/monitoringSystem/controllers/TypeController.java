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

import ma.storactive.monitoringSystem.entities.Type;
import ma.storactive.monitoringSystem.services.TypeServices;


@RestController
@RequestMapping("/api/v1/type/")
public class TypeController {	
	@Autowired
	TypeServices typeServices;
	
	@PostMapping("save")
	public Type createOrUpdateGenre(@RequestBody Type genre) {
		return typeServices.saveType(genre);
	}
	
	@GetMapping("getAll")
	public List<Type> getAllGenre(){
		return typeServices.getAllTypes();
	}
	@DeleteMapping("delete/{intitule}")
	public String delete(@PathVariable long intitule) {
		return typeServices.deleteType(intitule);
	}
	@GetMapping("getTransitionType")
	public Type getTransitionType() {
		return typeServices.getTransitionType();
	}
}
