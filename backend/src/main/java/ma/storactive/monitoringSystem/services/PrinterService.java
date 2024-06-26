package ma.storactive.monitoringSystem.services;

public interface PrinterService {
	boolean isConnected();
	void sendPacketToPrinter(byte[] packet);
	void sendLastMesureToPrinter();
}
