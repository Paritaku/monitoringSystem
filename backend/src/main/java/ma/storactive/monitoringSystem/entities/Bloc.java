package ma.storactive.monitoringSystem.entities;

import java.time.LocalDate;
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
public class Bloc {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long blocId;
	
	@Column(nullable = false, unique = true)
	private String blocName;

	@ManyToOne
	@JoinColumn(name = "genreId")
	private Genre genre;
	
	private LocalDate blocDate;
	
	private String blocStatut;
	
	@Column(columnDefinition = "int default 0")
	private int nbMatelas;

}
