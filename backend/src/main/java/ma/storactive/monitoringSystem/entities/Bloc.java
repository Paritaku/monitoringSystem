package ma.storactive.monitoringSystem.entities;

import java.time.LocalTime;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bloc {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	//Represente la position du bloc à l'intérieur de la coulée
	private long numero;
	
	private double hauteur;
	private double longueur;
	private double largeur;
	private double poids;
	private double densite;
	private String commentaire;
	@ManyToOne
	@JoinColumn(name = "coulee_Id")
	private Coulee coulee;

	@Column(columnDefinition = "time")
	private LocalTime heureEnregistrement;
	
	public String printerString() {
		return this.hauteur + ","  + this.longueur + "," + this.largeur + "," + this.poids + "," + this.densite + "," + this.coulee.getType().getIntitule();
	}
}
