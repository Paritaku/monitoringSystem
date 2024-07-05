package ma.storactive.monitoringSystem.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.storactive.monitoringSystem.entities.Produit;
import ma.storactive.monitoringSystem.services.ProduitService;


@RestController
@RequestMapping("api/v1/produit/")
public class ProduitController {
	@Autowired
	ProduitService produitService;
	
	@PostMapping("save")
	public Produit saveProduct(@RequestBody Produit p) {
		return produitService.saveProduct(p);
	}
	@GetMapping("getAllProduit")
	public List<Produit> getProduit(){
		return produitService.getAllProduit();
	}
	@GetMapping("getTodayProduct")
	public List<Produit> getTodayProduit(){
		return produitService.getTodayProduit();
	}
	@GetMapping("getLastId")
	public long getLastId(){
		return produitService.getLastId();
	}
	@DeleteMapping("delete/{id}")
	public void deleteProduit(@PathVariable Long id) {
		produitService.deleteProduit(id);
	}
}
