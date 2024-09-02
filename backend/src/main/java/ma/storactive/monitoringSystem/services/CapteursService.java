package ma.storactive.monitoringSystem.services;

import org.apache.plc4x.java.api.PlcConnection;

import ma.storactive.monitoringSystem.entities.Bloc;


public interface CapteursService {
	PlcConnection connect();
	boolean isConnected();
	Bloc getCapteursValues();
	double round(double value, int decimal);
	int validation();
	int presence();
	void sendMesures();
	void sendValidation();
	void sendPresence();
}
