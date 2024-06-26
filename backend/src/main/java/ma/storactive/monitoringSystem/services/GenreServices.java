package ma.storactive.monitoringSystem.services;

import java.util.List;

import ma.storactive.monitoringSystem.entities.Genre;

public interface GenreServices {
	Genre createOrUpdateGenre(Genre genre);
	String deleteGenre(long id);
	List<Genre> getAllGenre();
}
