package ma.storactive.monitoringSystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Genre;
import ma.storactive.monitoringSystem.repositories.GenreRepository;

@Service
public class GenreSerivcesImpl implements GenreServices {
	@Autowired
	GenreRepository genreRepository;

	@Override
	public String deleteGenre(long id) {
		Optional<Genre> genreBeingDeleted = genreRepository.findById(id);
		if (genreBeingDeleted.isPresent()) {
			genreRepository.deleteById(id);
			return genreBeingDeleted.get().getIntitule() + " supprimé";
		}
		return "Aucun genre ne possède cette id";
	}

	@Override
	public Genre createOrUpdateGenre(Genre genre) {
		genre.setIntitule(genre.getIntitule().toUpperCase());
		return genreRepository.save(genre);
	}

	@Override
	public List<Genre> getAllGenre() {
		return genreRepository.findAll();
	}

}
