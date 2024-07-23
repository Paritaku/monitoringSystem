package ma.storactive.monitoringSystem.services;

import java.time.LocalDate;
import java.util.List;

import ma.storactive.monitoringSystem.entities.Coulee;

public interface CouleeService {
	Coulee saveCoulee(Coulee coulee);
	String deleteCoulee(long id);
	List<Coulee> getAllCoulees();
	List<Coulee> getTodayCoulees();
	Long getNextNumCoulee();
	Coulee getCouleeEnCours();
	List<LocalDate> getDateList();
	List<Coulee> getCouleesPerDate(LocalDate date);
}

