import React, { useEffect, useState } from 'react'
import './DailyProduct.css'
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const DailyProduct = ({newProduct, setNewProduct}) => {
    const GET_DAILY_PRODUCT_URL = "http://localhost:8080/api/v1/produit/getTodayProduct";
    const [produitEnregistreToday, setproduitEnregistreToday] = useState([]);
    const WEB_SOCKET_URL = "http://localhost:8080/ws";

    //Charger les produits enregistrés aujourd'hui
    const loadTodayProduct= async () => {
        const {data} = await axios.get(GET_DAILY_PRODUCT_URL);
        setproduitEnregistreToday(data);
    }

    useEffect(() => {
        loadTodayProduct();
        //Socket pour actualiser le tableau de produit
        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe("/topic/produit/today", (message) => {
                    setproduitEnregistreToday(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers["message"]);
                console.error("Additional details: " + frame.body);
            },
        });
        stompClient.activate();

        //Deconnexion au démontage
        return () => {
            stompClient.deactivate();
        };
    },[])

    /*useEffect(() => {
        if(newProduct) {
            loadTodayProduct();
            setNewProduct(false);
        }
    },[newProduct])*/

    return (
        <div className='daily-product-container'>
            <h1>Produit du jour </h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Longueur</th>
                            <th>Largeur</th>
                            <th>Hauteur</th>
                            <th>Poids</th>
                            <th>Densite</th>
                            <th>Genre</th>
                            <th>Statut du BLOC </th>
                            <th>Bloc</th>
                            <th>Date d'enregistrement</th>
                            <th>Heure d'enregistrement</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( produitEnregistreToday.length > 0 )
                                ? produitEnregistreToday.map((produit) => (
                                    <tr key={produit.id} 
                                        className={
                                            (produit.bloc.genre.intitule !== "TRANSITION") ? produit.bloc.blocStatut : produit.bloc.genre.intitule
                                            }
                                    >
                                        <td>{produit.longueur}</td>
                                        <td>{produit.largeur}</td>
                                        <td>{produit.hauteur}</td>
                                        <td>{produit.poids}</td>
                                        <td>{produit.densite}</td>
                                        <td>{produit.bloc.genre.intitule}</td>
                                        <td>{produit.bloc.blocStatut}</td>
                                        <td>{produit.bloc.blocName}</td>
                                        <td>{produit.bloc.blocDate}</td>
                                        <td>{produit.heureEnregistrement}</td>
                                        
                                    </tr>
                                ))
                                :null
                        }
                    </tbody>
                </table>
            </div>
        </div>
  )
}
export default DailyProduct