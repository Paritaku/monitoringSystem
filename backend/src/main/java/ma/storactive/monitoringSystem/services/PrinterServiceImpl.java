package ma.storactive.monitoringSystem.services;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Bloc;
import ma.storactive.monitoringSystem.repositories.BlocRepository;


@Service
public class PrinterServiceImpl implements PrinterService {
	private static Socket printerSocket = null;
	private static String ipAddress = "192.168.0.20";
	private static int port = 9001;
	
	@Autowired
	BlocRepository produitRepository;
	

	@Override
	public boolean isConnected() {
		if (printerSocket == null) {
			try {
				printerSocket = new Socket(ipAddress, port);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return printerSocket.isConnected();
	}

	public byte[] getExternalDataPacket(Bloc mesure) {
		byte[] dataBytes = mesure.printerString().getBytes(StandardCharsets.UTF_8);

		byte[] commandBytes = new byte[4];
		commandBytes[0] = (byte) 0x10;
		commandBytes[1] = (byte) 0x66;
		commandBytes[2] = (byte) (dataBytes.length & 0xFF);
		commandBytes[3] = (byte) ((dataBytes.length >> 8) & 0xFF);

		byte[] packet = new byte[commandBytes.length + dataBytes.length];
		System.arraycopy(commandBytes, 0, packet, 0, commandBytes.length);
		System.arraycopy(dataBytes, 0, packet, commandBytes.length, dataBytes.length);
		return packet;
	}

	@Override
	public void sendPacketToPrinter(byte[] packet) {
		if (isConnected()) {
			try {
				OutputStream outputStream = printerSocket.getOutputStream();
				outputStream.write(packet);

				InputStream inputStream = printerSocket.getInputStream();
				byte[] response = new byte[1024];
				inputStream.read(response);

				System.out.println( "ACK : " + String.format("%02X", response[1]) + String.format("%02X", response[0]));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	@Override
	public void sendLastMesureToPrinter() {
		if(produitRepository.getLastBlocSaved().isPresent())
			sendPacketToPrinter(getExternalDataPacket(produitRepository.getLastBlocSaved().get()));
		}
	}
