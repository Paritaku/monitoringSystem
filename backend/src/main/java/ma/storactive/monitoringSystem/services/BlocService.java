package ma.storactive.monitoringSystem.services;

import java.util.List;

import ma.storactive.monitoringSystem.entities.Bloc;

public interface BlocService {
	Bloc createBloc(Bloc bloc);
	String deleteBloc(long id);
	List<Bloc> getAllBloc();
	List<Bloc> getTodayBloc();
}
