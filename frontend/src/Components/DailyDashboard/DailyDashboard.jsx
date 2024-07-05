//Un composant qui donne une vue globale de l'avancement de la production du jour
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SockJS from 'sockjs-client';
import "./DailyDashboard.css"

const DailyDashboard = () => {
    const [blocDuJour, setBlocDuJour] = useState([]);
    const GET_TODAY_BLOC_URL = "http://localhost:8080/api/v1/bloc/getTodayBloc";
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    const listBlocFini = blocDuJour.filter((bloc) => bloc.blocStatut === "TERMINE");

    const fetchBlocDuJour = async () => {
        const { data } = await axios.get(GET_TODAY_BLOC_URL);
        setBlocDuJour(data);
    }
    const countNbMatelasEnregistre = () => {
        var i = 0;
        console.log(listBlocFini)
        listBlocFini.forEach(bloc => {
            i = i + bloc.nbMatelas;
        });
        return i;
    }

    useEffect(() => {
        fetchBlocDuJour();
        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe("/topic/bloc/today", (message) => {
                    console.log(message.body)
                    setBlocDuJour(JSON.parse(message.body));
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        })
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        }
    }, [])

    return (
        <div className='daily-dashboard-container'>
            <div className='daily-dashboard-card'>
                <h2>Nombre de bloc programmé</h2>
                <p>{blocDuJour.length} programmé(s)</p>
            </div>
            <div className='daily-dashboard-card'>
                <h2> Avance de la production </h2>
                <p> {listBlocFini.length} bloc{listBlocFini.length > 0 ? "s" : ""} terminé{listBlocFini.length > 0 ? "s" : null}</p>
                <p> {countNbMatelasEnregistre()}  matelas enregistre{listBlocFini.length > 0 ? "s" : ""} </p>
            </div>
            {
                blocDuJour.map((bloc) => (
                    <div className='daily-dashboard-card'>
                        <h2> {bloc.blocName} </h2>
                        <p>{bloc.genre.intitule} </p>
                        <p>{bloc.nbMatelas} matelas </p>
                        <p>{bloc.blocStatut}</p>      
                    </div>
                ))
            }
        </div>
    )
}
export default DailyDashboard