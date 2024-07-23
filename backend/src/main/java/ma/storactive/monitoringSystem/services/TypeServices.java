package ma.storactive.monitoringSystem.services;

import java.util.List;

import ma.storactive.monitoringSystem.entities.Type;

public interface TypeServices {
	Type saveType(Type genre);
	String deleteType(long id);
	List<Type> getAllTypes();
	Type getTransitionType();
}
