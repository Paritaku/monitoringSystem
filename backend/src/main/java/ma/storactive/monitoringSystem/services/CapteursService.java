package ma.storactive.monitoringSystem.services;

import org.apache.plc4x.java.api.PlcConnection;

import ma.storactive.monitoringSystem.entities.Produit;


public interface CapteursService {
	PlcConnection connect();
	boolean isConnected();
	Produit getCapteursValues();
	double round(double value, int decimal);
	int validation();
}
