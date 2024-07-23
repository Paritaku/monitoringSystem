package ma.storactive.monitoringSystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Type;
import ma.storactive.monitoringSystem.repositories.TypeRepository;

@Service
public class TypeSerivcesImpl implements TypeServices {
	@Autowired
	TypeRepository typeRepository;

	@Override
	public String deleteType(long id) {
		Optional<Type> genreBeingDeleted = typeRepository.findById(id);
		if (genreBeingDeleted.isPresent()) {
			typeRepository.deleteById(id);
			return genreBeingDeleted.get().getIntitule() + " supprimé";
		}
		return "Aucun genre ne possède cette id";
	}

	@Override
	public Type saveType(Type genre) {
		genre.setIntitule(genre.getIntitule().toUpperCase());
		return typeRepository.save(genre);
	}

	@Override
	public List<Type> getAllTypes() {
		return typeRepository.findAll();
	}

	@Override
	public Type getTransitionType() {
		Optional<Type> response = typeRepository.findByIntitule("TRANSITION");
		if(response.isPresent()) {
			return response.get();
		}
		return null;
	}
}
