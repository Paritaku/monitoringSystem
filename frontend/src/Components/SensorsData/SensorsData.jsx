/*Lecture des données de capteurs et sauvegarde des blocs */
import "./SensorsData.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function SensorsData(props) {
    //
    const ADD_BLOC_URL = "http://localhost:8080/api/v1/bloc/save";
    //
    const SAVE_COULEE_URL = "http://localhost:8080/api/v1/coulee/save";
    //
    const PRINTER_CONNECTION_STATUS = "http://localhost:8080/api/v1/printer/statut";
    //
    const SEND_PRODUCT_TO_PRINTER_URL = "http://localhost:8080/api/v1/printer/sendlastproduct";
    //
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    //
    const LAST_PRODUIT_ID_URL = "http://localhost:8080/api/v1/produit/getLastId";

    //
    const handleCapteursChange = (event) => {
        const { name, value } = event.target;
        props.setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };
    const handleValidationChange = (event) => {
        const { name, value } = event.target;
        props.setValidationInputValue(value);
    };
    const handlePresenceChange = (event) => {
        const { name, value } = event.target;
        props.setPresenceInputValue(value);
    };

    //Ajout d'un bloc à la BDD et incrementation du count de bloc dans la coulée
    async function addBloc(comment) {
        if (props.couleeEnCours.statut === "EN COURS") {
            let longueurInputComment = (props.formValue.longueurInputValue > 0 ? "" : "Longueur incorrecte!");
            let largeurInputComment = (props.formValue.largeurInputValue > 0 ? "" : "Largeur incorrecte!");
            let hauteurInputComment = (props.formValue.hauteurInputValue > 0 ? "" : "Hauteur incorrecte!");
            let poidsInputComment = (props.formValue.poidsInputValue > 0 ? "" : "Poids incorrecte!");
            let densiteInputComment = (props.formValue.densiteInputValue > 0 ? "" : "Densite incorrecte!");

            let finalComment = longueurInputComment + largeurInputComment + poidsInputComment + hauteurInputComment + densiteInputComment + comment;

            const bloc = {
                id: null,
                numero: (props.couleeEnCours.nbBloc + 1),
                hauteur: props.formValue.hauteurInputValue,
                longueur: props.formValue.longueurInputValue,
                largeur: props.formValue.largeurInputValue,
                poids: props.formValue.poidsInputValue,
                densite: props.formValue.densiteInputValue,
                coulee: props.couleeEnCours,
                heureEnregistrement: getTime(),
                commentaire: finalComment
            };
            console.log(bloc);
            const response = await axios.post(ADD_BLOC_URL, bloc);
            if (response.status === 200) {
                /* //Verifier si l'imprimante est connecté
                const printer_connected = await axios.get(PRINTER_CONNECTION_STATUS);
                if (printer_connected.data === true) {
                    //Envoyer le produit enregistré à l'imprimante
                    const response2 = await axios.post(SEND_PRODUCT_TO_PRINTER_URL);
                    response2.status === 200
                        ? console.log("Données envoyées")
                        : console.log("Erreur lors de l'envoi");
                }*/
                props.setCouleeEnCours((prev) => {
                    const a = {
                        ...prev,
                        nbBloc: Number(prev.nbBloc) + 1
                    }
                    console.log(a);
                    axios.post(SAVE_COULEE_URL, a);
                    return a;
                })

                /*props.setFormValue((prev) => ({
                    hauteurInputValue: "",
                    longueurInputValue: "",
                    largeurInputValue: "",
                    poidsInputValue: "",
                    densiteInputValue: "",
                    presenceInputValue: 0,
                    validationInputValue: 0,
                }));*/
        }
    }
    };

    //Recupérer l'heure sous la forme hh-mm-ss
    function getTime() {
        const instant = new Date();
        const hours = String(instant.getHours()).padStart(2, "0");
        const minutes = String(instant.getMinutes()).padStart(2, "0");
        const seconds = String(instant.getSeconds()).padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
    };

    useEffect(() => {
        if(props.validationInputValue == 1) {
            addBloc("");
        }
    },[props.validationInputValue])

    useEffect(() => {
        if(props.validationInputValue != 1 && props.presenceInputValue == 1 ) {
            let validationInputComment = "Verrin non levé";
            addBloc(validationInputComment);
        }
    },[props.presenceInputValue])

    return (
        <div className="sensors-data-container">
            <div className="sensors-input-box">
                <label>Numero de coulée</label>
                <input
                    readOnly
                    disabled
                    value={props.couleeEnCours.numero || props.couleeEnCours.nom}
                    name="numeroInputValue"
                />
            </div>

            <div className="sensors-input-box">
                <label>Type</label>
                <input
                    readOnly
                    disabled
                    value={props.couleeEnCours?.type?.intitule}
                    name="numeroInputValue"
                    step={1}
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>

            <div className="sensors-input-box">
                <label>Numéro du bloc</label>
                <input
                    type="number"
                    readOnly
                    disabled
                    value={props.couleeEnCours.nbBloc + 1}
                    name="numeroInputValue"
                />
            </div>
            <div className="sensors-input-box">
                <label>Longueur</label>
                <input
                    type="number"
                    value={props.formValue.longueurInputValue}
                    name="longueurInputValue"
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Largeur</label>
                <input
                    type="number"
                    value={props.formValue.largeurInputValue}
                    name="largeurInputValue"
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Hauteur</label>
                <input
                    type="number"
                    value={props.formValue.hauteurInputValue}
                    name="hauteurInputValue"
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Poids</label>
                <input
                    type="number"
                    value={props.formValue.poidsInputValue}
                    name="poidsInputValue"
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Densite</label>
                <input
                    type="number"
                    value={props.formValue.densiteInputValue}
                    name="densiteInputValue"
                    onChange={(event) => handleCapteursChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Presence</label>
                <input
                    type="number"
                    name="presenceInputValue"
                    value={props.presenceInputValue}
                    onChange={(event) => handlePresenceChange(event)}
                />
            </div>
            <div className="sensors-input-box">
                <label>Validation</label>
                <input
                    type="number"
                    name="validationInputValue"
                    value={props.validationInputValue}
                    onChange={(event) => handleValidationChange(event)}
                />
            </div>
        </div>
    );
}
