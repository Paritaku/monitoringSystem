package ma.storactive.monitoringSystem.entities;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Coulee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private Long numero;
	
	@Column(unique = true)
	private String nom;
	
	@ManyToOne
	@JoinColumn(name = "type_id")
	private Type type;
	
	private LocalDate date;
	
	@Column(columnDefinition = "time")
	private LocalTime startTime;
	@Column(columnDefinition = "time")
	private LocalTime endTime;
	
	private String statut;
	
	@Column(columnDefinition = "int default 0")
	private int nbBloc;
}
