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

import ma.storactive.monitoringSystem.entities.Genre;
import ma.storactive.monitoringSystem.services.GenreServices;


@RestController
@RequestMapping("/api/v1/genre/")
public class GenreController {
	@Autowired
	GenreServices genreServices;
	
	@PostMapping("save")
	public Genre createOrUpdateGenre(@RequestBody Genre genre) {
		return genreServices.createOrUpdateGenre(genre);
	}
	
	@GetMapping("getAll")
	public List<Genre> getAllGenre(){
		return genreServices.getAllGenre();
	}
	@DeleteMapping("delete/{intitule}")
	public String delete(@PathVariable long intitule) {
		return genreServices.deleteGenre(intitule);
	}
}
