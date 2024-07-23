import React, { useEffect, useState } from 'react';
import SensorsData from '../SensorsData/SensorsData';
import CouleeProduction from '../CouleeProduction/CouleeProduction';
import "./ProdDuJour.css";
import axios from 'axios';
import CouleeDisplay from '../CouleeDisplay/CouleeDisplay';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DailyCouleeList from '../DailyCouleeList/DailyCouleeList';


export default function ProdDuJour() {
    //URL API pour récupérer la coulée en cours
    const COULEE_EN_COURS_URL = "http://localhost:8080/api/v1/coulee/getCouleeEnCours";
    //
    const [couleeEnCours, setCouleeEnCours] = useState({});
    //
    const COULEES_DU_JOUR_URL = "http://localhost:8080/api/v1/coulee/getTodayCoulee";
    //
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    //coulee du jour web socket topic url
    const COULEE_DU_JOUR_TOPIC_URL = "/topic/coulee/today";
    //Usestate pour stocker les coulées du jour
    const [couleesDuJour, setCouleesDuJour] = useState([]);
    //Pour stocker les données des capteurs
    const [formValue, setFormValue] = useState({
        hauteurInputValue: "",
        longueurInputValue: "",
        largeurInputValue: "",
        poidsInputValue: "",
        densiteInputValue: "",
        validationInputValue: "",
    });

    //Fonction pour recuperer les coulées du jour depuis l'API
    async function fetchTodayCoulees() {
        await axios.get(COULEES_DU_JOUR_URL)
            .then(response => setCouleesDuJour(response.data))
            .catch(error => console.log(error))
    }
    //Recuperer la coulée en cours depuis  la BDD
    async function initalizeCouleeEnCours() {
        await axios.get(COULEE_EN_COURS_URL)
            .then(response => setCouleeEnCours(response.data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        initalizeCouleeEnCours();
        fetchTodayCoulees();

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
                stompClient.subscribe(COULEE_DU_JOUR_TOPIC_URL, (message) => {
                    setCouleesDuJour(JSON.parse(message.body));
                })
                stompClient.subscribe("/topic/data", (message) => {
                    var p = JSON.parse(message.body);
                    setFormValue((prev) => ({
                        ...prev,
                        hauteurInputValue: p.hauteur,
                        longueurInputValue: p.longueur,
                        largeurInputValue: p.largeur,
                        poidsInputValue: p.poids,
                        densiteInputValue: p.densite,
                    }));
                });
                stompClient.subscribe("/topic/validation", (message) => {
                    console.log(JSON.parse(message.body));
                    setFormValue((prev) => ({
                        ...prev,
                        validationInputValue: JSON.parse(message.body)
                    }))
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        stompClient.activate();
        //Deconnexion au démontage
        return () => {
            stompClient.deactivate();
        }
    }, [])

    return (
        <div className='prod-du-jour' >
            <div className='row'>
                <SensorsData
                    couleeEnCours={couleeEnCours}
                    setCouleeEnCours={setCouleeEnCours}
                    formValue = {formValue}
                    setFormValue = {setFormValue}
                />
                <CouleeProduction
                    couleeEnCours={couleeEnCours}
                    setCouleeEnCours={setCouleeEnCours}
                    couleesDuJour={couleesDuJour}
                />
            </div>
            <DailyCouleeList
                couleesDuJour={couleesDuJour}
            />
        </div>
    )
}
