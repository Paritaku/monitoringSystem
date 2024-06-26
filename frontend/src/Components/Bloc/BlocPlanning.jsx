import React, { useEffect, useState } from 'react'
import './BlocPlanning.css'
import { Button } from '@mui/material'
import AjoutBloc from './AjoutBloc'
import axios from 'axios';
import {LoadingOutlined } from '@ant-design/icons';

function BlocPlanning({startBloc, endBloc}) {
    const GET_BLOC_DU_JOUR_URL = "http://localhost:8080/api/v1/bloc/getTodayBloc";
    const DELETE_BLOC_URL = "http://localhost:8080/api/v1/bloc/delete/"
    const [dialogState, setDialogState] = useState(false);
    const [blocChanged, setBlocChanged] = useState(false);
    const showDialog = () => {
        setDialogState(true);
    }

    const [blocDuJour, setBlocDuJour] = useState([]);
    
    const fetchBlocDuJour = async () => {
        const {data} = await axios.get(GET_BLOC_DU_JOUR_URL);
        setBlocDuJour(data);
    }

    useEffect(() => {
        fetchBlocDuJour();
    },[])

    useEffect(() => {
        if(blocChanged){
            fetchBlocDuJour();
            setBlocChanged(false);
        }
    },[blocChanged])

    const handleDelete = async (blocId) => {
        try {
            const response = await axios.delete(DELETE_BLOC_URL + blocId);
            if(response.status === 200) {
                fetchBlocDuJour();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div class="bloc-planning-container">
            
                {
                    blocDuJour.length === 0 
                        ?   <div className='no-bloc-today'> <h2> Aucun bloc programmé aujourd'hui </h2> </div>
                        :   <div className='table-bloc'>
                                <h2> Bloc du jour </h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th> Nom du Bloc</th>
                                            <th> Type de Bloc </th>
                                            <th> Status </th>
                                            <th> Date </th>
                                            <th> Actions </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            blocDuJour.map((bloc) => (
                                                <tr key={bloc.blocId}>
                                                    <td> {bloc.blocName} </td>
                                                    <td> {bloc.genre.intitule} </td>
                                                    <td> {(bloc.blocStatut === "EN-COURS") 
                                                            ?<span className='bloc-en-cours'> <LoadingOutlined style={{fontSize: "3rem", color: "green"}} /> </span>
                                                            : ""}
                                                         {
                                                           (bloc.blocStatut === "TERMINE") 
                                                           ?<span className='bloc-termine'> {bloc.blocStatut} </span>
                                                           : "" 
                                                         }
                                                         {
                                                           (bloc.blocStatut === "INITIALISE") 
                                                           ?<span className='bloc-initialise'> {bloc.blocStatut} </span>
                                                           : "" 
                                                         }

                                                    </td>
                                                    <td> {bloc.blocDate} </td>
                                                    <td> 
                                                        <Button variant='contained' color='success' onClick={() => startBloc(bloc)}> Demarrer </Button>
                                                        <Button variant='contained' color='warning' onClick={() => endBloc(bloc)}> Terminer </Button>
                                                        <Button variant='contained' color='error' onClick={() => handleDelete(bloc.blocId)}> Supprimer  </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                }
            <div>
                <Button variant='contained' color='success' onClick={showDialog}> Ajouter un Bloc </Button>
            </div>
            <div>
                <AjoutBloc dialogState={dialogState} setDialogState={setDialogState} update={fetchBlocDuJour}  />
            </div>

        </div>
  )
}
export default BlocPlanning