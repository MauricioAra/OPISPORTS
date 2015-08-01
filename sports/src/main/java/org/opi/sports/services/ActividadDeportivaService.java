package org.opi.sports.services;

import java.util.List;

import javax.transaction.Transactional;

import org.opi.sports.ejb.ActividadDeportiva;
import org.opi.sports.repositories.ActividadDeportivaRepository;
import org.opi.sports.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Fecha: 29-07-2015 version 1.0
 * 
 * @author Juan Manuel Viales Chavarría
 * 
 *Sprint #5 Descripción: Actvidad Deportiva que se encarga de comuicarse con el repositorio para
 * las consulta a la base de datos.
 */
@Service
public class ActividadDeportivaService implements ActividadDeportivaServiceInterface {
	
	@Autowired
	ActividadDeportivaRepository actividadDeportivaRepository;

	@Override
	public List<ActividadDeportiva> getAllActividadDeportiva() {
		return actividadDeportivaRepository.findAll();
	}

	@Override
	public <ActividadesDeportivas extends ActividadDeportiva> ActividadesDeportivas save(
			ActividadesDeportivas actividadDeportiva) {
		// TODO Auto-generated method stub
		return actividadDeportivaRepository.save(actividadDeportiva);
	}
	

	@Override
	public boolean exists(Integer idActividadDeportiva) {
		// TODO Auto-generated method stub
		return actividadDeportivaRepository.exists(idActividadDeportiva);
	}



	

}
