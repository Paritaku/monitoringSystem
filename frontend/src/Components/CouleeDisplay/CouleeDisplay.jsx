import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./CouleeDisplay.css"
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function CouleeDisplay(props) {
    //URL où envoyer le get à l'api pour récupérer les blocs par coulées
    const GET_BLOCS_BY_COULEE_URL = "http://localhost:8080/api/v1/bloc/getBlocsByCouleeId/" + props.coulee.id;
    //
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    //
    const BLOC_PER_COULEE_SUBSCRIPTION_URL = "/topic/bloc/today/"+props.coulee.id

    //Use state pour stocker  les blocs par coulée
    const [listBlocs, setListBlocs] = useState([]);
    //function pour recupérer les blocs 
    function fecthListBlocs(){
        axios.get(GET_BLOCS_BY_COULEE_URL)
            .then(response => setListBlocs(response.data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        fecthListBlocs();
        //Creation d'un websocket
        const socket = new SockJS(WEB_SOCKET_URL);
        //Creation d'un client
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe(BLOC_PER_COULEE_SUBSCRIPTION_URL, (message) => {
                    setListBlocs(JSON.parse(message.body));
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });
        stompClient.activate();

        return () => {
            if(stompClient)
                stompClient.deactivate();
        }

    },[])

    return (
        <div className='coulee-display'>
            <details>
                <summary 
                    className={
                        props.coulee.type.intitule === "TRANSITION" ? props.coulee.type.intitule : props.coulee.statut.replace(/\s+/g,'-')
                    }
                >
                    {
                        (props.coulee.numero && ("Coulee " + props.coulee.numero)) ||
                        (props.coulee.nom && ("Transition " + props.coulee.nom))
                    } 
                </summary>
                {listBlocs.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Numéro de coulée</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Numéro du bloc</th>
                                <th>Longueur</th>
                                <th>Largeur</th>
                                <th>Hauteur</th>
                                <th>Poids</th>
                                <th>Densite</th>
                                <th>Heure d'enregistrement</th>
                                <th>Commentaires</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listBlocs.map((bloc) => (
                                <tr key={bloc.id}>
                                    <td>{bloc.coulee.numero || bloc.coulee.nom} </td>
                                    <td>{bloc.coulee.type.intitule}</td>
                                    <td>{bloc.coulee.date}</td>
                                    <td>{bloc.numero}</td>
                                    <td>{bloc.longueur}</td>
                                    <td>{bloc.largeur}</td>
                                    <td>{bloc.hauteur}</td>
                                    <td>{bloc.poids}</td>
                                    <td>{bloc.densite}</td>
                                    <td>{bloc.heureEnregistrement}</td>
                                    <td>{bloc.commentaire}</td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                )}  
            </details>
        </div>
  )
}
