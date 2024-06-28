import "./SensorsData.css";
import React, { useEffect, useRef, useState } from "react";
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SensorsData = ({ blocEnCours, newProduct, setNewProduct }) => {
    const [formValue, setFormValue] = useState({
        hauteurInputValue: "",
        longueurInputValue: "",
        largeurInputValue: "",
        poidsInputValue: "",
        densiteInputValue: "",
        validationInputValue: "",
    });
    const ADD_PRODUIT_URL = "http://localhost:8080/api/v1/produit/save";
    const PRINTER_CONNECTION_STATUS =
        "http://localhost:8080/api/v1/printer/statut";
    const SEND_PRODUCT_TO_PRINTER_URL =
        "http://localhost:8080/api/v1/printer/sendlastproduct";
    const WEB_SOCKET_URL = "http://localhost:8080/ws";

    const getTime = () => {
        const instant = new Date();
        const hours = String(instant.getHours()).padStart(2, "0");
        const minutes = String(instant.getMinutes()).padStart(2, "0");
        const seconds = String(instant.getSeconds()).padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
    };

    const fetchMesures = async () => {
        /*const connexion_statut = await axios.get(CAPTEUR_CONNEXION_STATUS_URL);
            console.log(connexion_statut.data);
            if(connexion_statut.data) {
                const mesure = await axios.get(CAPTEURS_MESURES_URL);
                const validation = await axios.get(CAPTEUR_VALIDATION_URL);
                if(mesure.data !== null) {
                    setFormValue((previous) => ({
                        ...previous,
                        hauteurInputValue: mesure.data.hauteur,
                        longueurInputValue: mesure.data.longueur,
                        largeurInputValue: mesure.data.largeur,
                        poidsInputValue: mesure.data.poids,
                        densiteInputValue: mesure.data.densite,
                    }))
                }
                if(validation.status === 200) {
                    setFormValue((previous) => ({
                        ...previous,
                        validationInputValue: validation.data
                    }))
                }
            }*/
    };

    const [validMesure, setValidMesure] = useState(false);

    const handleCapteursChange = (event) => {
        const { name, value } = event.target;
        setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };

    const addProduct = async () => {
        const produit = {
            id: null,
            hauteur: formValue.hauteurInputValue,
            longueur: formValue.longueurInputValue,
            largeur: formValue.largeurInputValue,
            poids: formValue.poidsInputValue,
            densite: formValue.densiteInputValue,
            bloc: blocEnCours,
            heureEnregistrement: getTime(),
        };
        console.log(produit);
        const response = await axios.post(ADD_PRODUIT_URL, produit);
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
            setFormValue({
                hauteurInputValue: "",
                longueurInputValue: "",
                largeurInputValue: "",
                poidsInputValue: "",
                densiteInputValue: "",
                validationInputValue: "",
            });
            setNewProduct(true);
        }
    };

    //Verification que tous les champs sont corrects
    useEffect(() => {
        const {
            hauteurInputValue,
            longueurInputValue,
            largeurInputValue,
            poidsInputValue,
            densiteInputValue,
            validationInputValue,
        } = formValue;

        const isValid =
            hauteurInputValue > 0 &&
            longueurInputValue > 0 &&
            largeurInputValue > 0 &&
            poidsInputValue > 0 &&
            densiteInputValue > 0 &&
            validationInputValue > 0 &&
            (blocEnCours?.blocName ? true : false) &&
            (blocEnCours?.genre?.intitule ? true : false);
        setValidMesure(isValid);
    }, [formValue]);

    //Ajout du produit si tous les champs sont corrects
    useEffect(() => {
        if (validMesure) {
            addProduct();
        }
    }, [validMesure]);

    /*useEffect(() => {
          setInterval(fetchMesures,250);
      },[])*/

    useEffect(() => {
        //Connexion au websocket pour la lecture des données des capteurs en temps réel
        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Connected");

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
                    setFormValue((prev) => ({
                        ...prev,
                        validationInputValue: JSON.parse(message.body),
                    }));
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
    }, []);

    return (
        <>
            <div className="sensors-data-container">
                <div className="sensors-input-box">
                    <label>Hauteur</label>
                    <input
                        type="number"
                        value={formValue.hauteurInputValue}
                        name="hauteurInputValue"
                        step={0.01}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.hauteurInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label>Longueur</label>
                    <input
                        type="number"
                        name="longueurInputValue"
                        value={formValue.longueurInputValue}
                        step={0.01}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.longueurInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label>Largeur</label>
                    <input
                        type="number"
                        name="largeurInputValue"
                        value={formValue.largeurInputValue}
                        step={0.01}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.largeurInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label>Poids</label>
                    <input
                        type="number"
                        name="poidsInputValue"
                        value={formValue.poidsInputValue}
                        step={0.01}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.poidsInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label>Densite</label>
                    <input
                        type="number"
                        name="densiteInputValue"
                        value={formValue.densiteInputValue}
                        step={0.01}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.densiteInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label> Nom du bloc </label>
                    <input
                        type="text"
                        name="blocName"
                        value={blocEnCours?.blocName ?? ""}
                    />
                    <span>
                        {blocEnCours?.blocName ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label> Type du bloc </label>
                    <input
                        type="text"
                        name="blocType"
                        value={blocEnCours?.genre?.intitule ?? ""}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {blocEnCours?.genre?.intitule ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>

                <div className="sensors-input-box">
                    <label>Validation</label>
                    <input
                        type="number"
                        name="validationInputValue"
                        value={formValue.validationInputValue}
                        onChange={(event) => handleCapteursChange(event)}
                    />
                    <span>
                        {formValue.validationInputValue > 0 ? (
                            <CheckSquareOutlined
                                style={{ fontSize: "30px", color: "green" }}
                            />
                        ) : (
                            <CloseSquareOutlined style={{ fontSize: "30px", color: "red" }} />
                        )}
                    </span>
                </div>
            </div>
        </>
    );
};
export default SensorsData;
