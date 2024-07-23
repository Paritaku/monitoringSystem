package ma.storactive.monitoringSystem.services;

import java.util.List;

import ma.storactive.monitoringSystem.entities.Bloc;

public interface BlocService {
	Bloc saveBloc(Bloc p);
	
	void deleteBloc(Long id);
	
	long getLastId();

	List<Bloc> getAllBlocs();

	List<Bloc> getTodayBlocs();

	List<Bloc> getBlocsByCouleeId(Long id);

}
