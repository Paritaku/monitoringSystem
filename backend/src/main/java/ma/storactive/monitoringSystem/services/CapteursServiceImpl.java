package ma.storactive.monitoringSystem.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.concurrent.ExecutionException;

import org.apache.plc4x.java.DefaultPlcDriverManager;
import org.apache.plc4x.java.api.PlcConnection;
import org.apache.plc4x.java.api.exceptions.PlcConnectionException;
import org.apache.plc4x.java.api.messages.PlcReadRequest;
import org.apache.plc4x.java.api.messages.PlcReadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import ma.storactive.monitoringSystem.entities.Bloc;

@Service
public class CapteursServiceImpl implements CapteursService {
	private static PlcConnection plcConnection = null;
	@Autowired
	private SimpMessagingTemplate template;

	@Override
	public PlcConnection connect() {
		if (plcConnection == null) {
			try {
				plcConnection = new DefaultPlcDriverManager()
						.getConnection("s7://192.168.0.1?remote-rack=0&remote-slot=1&controller-type=S7_1200");
			} catch (PlcConnectionException e) {
				System.out.println("Le capteur n'est pas connecté à la machine");
			}
		}
		return plcConnection;
	}

	@Override
	public boolean isConnected() {
		if (connect() == null)
			return false;
		else
			return connect().isConnected();
	}

	@Override
	public Bloc getCapteursValues() {
		connect();
		if (isConnected()) {
			PlcReadRequest.Builder requestBuilder = plcConnection.readRequestBuilder();
			requestBuilder.addTagAddress("longueur", "%MD4:REAL");
			requestBuilder.addTagAddress("largeur", "%MD0:REAL");
			requestBuilder.addTagAddress("hauteur", "%MD8:REAL");
			requestBuilder.addTagAddress("poids", "%MD12:REAL");
			requestBuilder.addTagAddress("densite", "%MD16:REAL");

			PlcReadRequest readRequest = requestBuilder.build();

			try {
				PlcReadResponse readResponse = readRequest.execute().get();

				Bloc p = Bloc.builder().longueur(round(readResponse.getDouble("longueur"), 2))
						.largeur(round(readResponse.getDouble("largeur"), 2))
						.hauteur(round(readResponse.getDouble("hauteur"), 2))
						.poids(round(readResponse.getDouble("poids"), 2))
						.densite(round(readResponse.getDouble("densite"), 2)).build();

				return p;
			} catch (InterruptedException | ExecutionException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	public double round(double value, int decimal) {
		if (decimal < 0)
			throw new IllegalArgumentException();

		BigDecimal bigDecimal = new BigDecimal(Double.toString(value));
		bigDecimal = bigDecimal.setScale(decimal, RoundingMode.HALF_UP);
		return bigDecimal.doubleValue();
	}

	@Override
	public int validation() {
		if (isConnected()) {
			PlcReadRequest.Builder requestBuilder = plcConnection.readRequestBuilder();
			requestBuilder.addTagAddress("validation", "%IW34:INT");

			PlcReadRequest readRequest = requestBuilder.build();
			try {
				PlcReadResponse readResponse = readRequest.execute().get();
				return readResponse.getInteger("validation");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return -1;
	}
	
	@Override
	public int presence() {
		if(isConnected()) {
			PlcReadRequest.Builder requestBuilder = plcConnection.readRequestBuilder();
			requestBuilder.addTagAddress("presence", "%IW36:INT");

			PlcReadRequest readRequest = requestBuilder.build();
			try {
				PlcReadResponse readResponse = readRequest.execute().get();
				return readResponse.getInteger("presence");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return -2;
	}

	@Scheduled(fixedRate = 10)
	@Override
	public void sendMesures() {
		Bloc b = getCapteursValues();
		if(b != null)
			template.convertAndSend("/topic/data", getCapteursValues());
	}

	@Scheduled(fixedRate = 10)
	@Override
	public void sendValidation() {
		int validation = validation();
		template.convertAndSend("/topic/validation", validation);
	}

	@Override
	@Scheduled(fixedRate = 10)
	public void sendPresence() {
		template.convertAndSend("/topic/presence", presence());	
	}
}
