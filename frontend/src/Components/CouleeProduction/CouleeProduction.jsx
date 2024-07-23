import React, { startTransition, useEffect, useState } from 'react'
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BtnAddCoulee from '../BtnAddCoulee/BtnAddCoulee';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import "./CouleeProduction.css"
import BtnStartCoulee from './BtnStartCoulee';
import BtnDeleteCoulee from './BtnDeleteCoulee';

//Composer pour controler la prod, ajouter, demarrer, terminer une coulée et gestion des transitions entre les coulées
export default function CouleeProduction(props) {
    const statutList = ["EN ATTENTE", "EN COURS", "TERMINE"];
    //Variable pour stocker le numéro de coulée
    const [couleeNum, setCouleeNum] = useState('');
    //
    const SAVE_COULEE_URL = "http://localhost:8080/api/v1/coulee/save";
    //
    const COULEE_NUM_URL = "http://localhost:8080/api/v1/coulee/getNextNumCoulee";
    //
    const TRANSITION_TYPE_URL = "http://localhost:8080/api/v1/type/getTransitionType";
    //
    const [transitionType, setTransitionType] = useState();
    //boolean pour l'ouverture/fermerture de la boite de dialogue pour démarrer une coulée
    const [boolStartCoulee, setBoolStartCoulee] = useState(false);
    //boolean pour l'ouverture/fermerture de la boite de dialogue pour démarrer une coulée
    const [boolEndCoulee, setBoolEndCoulee] = useState(false);
    //
    const DELETE_COULEE_URL = "http://localhost:8080/api/v1/coulee/delete/";
    //
    const [boolStartTransition, setBoolStartTransition] = useState(false);
    const [boolEndTransition, setBoolEndTransition] = useState(false);

    function showStartTransitionDialog() {
        setBoolStartTransition(true);
    }
    function hideStartTransitionDialog() {
        setBoolStartTransition(false);
    }
    function showEndTransitionDialog() {
        setBoolEndTransition(true);
    }
    function hideEndTransitionDialog() {
        setBoolEndTransition(false);
    }

    //Recupérer l'heure sous la forme hh-mm-ss
    function getTime() {
        const instant = new Date();
        const hours = String(instant.getHours()).padStart(2, "0");
        const minutes = String(instant.getMinutes()).padStart(2, "0");
        const seconds = String(instant.getSeconds()).padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
    };

    //Enregistrer ou Modifier une coulée
    async function saveCoulee(coulee) {
        try {
            const response = await axios.post(SAVE_COULEE_URL, coulee);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    //Recuperer le numéro de coulée
    async function fetchCouleeNum() {
        const response = await axios.get(COULEE_NUM_URL)
            .then(response => setCouleeNum(response.data))
            .catch(error => console.log(error))
    }
    //Recuperer l'entite Type ayant comme valeur intitule transition
    async function fetchTransitionType() {
        await axios.get(TRANSITION_TYPE_URL)
            .then(response => setTransitionType(response.data))
            .catch(error => console.log(error))
    }

    //Fonction pour changer l'affichage du statut de la coulée
    function renderingCouleeStatus(status) {
        switch (status) {
            case statutList[0]:
                return <span className='coulee-en-attente'> {status} </span>;
            case statutList[1]:
                return <span className='coulee-en-cours'> <LoadingOutlined style={{ fontSize: "3rem", color: "green" }} /></span>
            case statutList[2]:
                return <span className='coulee-termine'> {status} </span>
        }
    }
    //Function pour changer le numéro de départ
    function changeCouleeNum(event) {
        let value = event.target.value;
        if (value > 0 && value !== "") {
            setCouleeNum(value);
        }
    }
    //
    function showStartDialog(coulee) {
        setBoolStartCoulee(true);
    }

    //Function start coulee qui donne un numéro à la coulée, change son statut dans la base de donnée puis incrémente le numéro de coulée
    function startCoulee(coulee) {
        function saving() {
            coulee.statut = statutList[1];
            coulee.startTime = getTime();
            if (couleeNum > 0 && coulee.numero === null) {
                coulee.numero = couleeNum;
                setCouleeNum(Number(couleeNum) + 1);
            }
            saveCoulee(coulee);
        }

        if (Object.keys(props.couleeEnCours).length !== 0) {
            props.setCouleeEnCours(prev => {
                const updateCoulee = {
                    ...prev,
                    statut: statutList[2],
                    endTime: getTime()
                };
                saveCoulee(updateCoulee);
                return {};
            });
        }
        saving();
        props.setCouleeEnCours(coulee);
        hideStartDialog();
    }

    function hideStartDialog() {
        setBoolStartCoulee(false);
    }

    //Terminer la coulée
    function endCoulee(coulee) {
        coulee.statut = statutList[2];
        coulee.endTime = getTime();
        saveCoulee(coulee);
        props.setCouleeEnCours(coulee);
    }

    async function deleteCoulee(coulee) {
        await axios.delete(DELETE_COULEE_URL + coulee.id)
            .then((response) => console.log(response.data))
            .catch(error => console.log(error))
    }

    //Fonction démarrer une transition
    async function startTransition() {
        props.setCouleeEnCours((prev) => {
            const a = {
                ...prev,
                statut: statutList[2],
                endTime: getTime(),
            }
            saveCoulee(a);
            return a;
        })
        const transitionTemplate = {
            id: null,
            nom: props.couleeEnCours.numero + " => " + (Number(props.couleeEnCours.numero) + 1),
            numero: null,
            type: transitionType,
            date: props.couleeEnCours.date,
            statut: statutList[1],
            startTime: getTime()
        }
        const transitionSaved = await saveCoulee(transitionTemplate);
        props.setCouleeEnCours((prev) => {
            return transitionSaved;
        })
    }

    //Fonction terminer la transition
    function endTransition() {
        const a = {
            ...props.couleeEnCours,
            statut: statutList[2],
            endTime: getTime()
        }
        console.log(a);
        saveCoulee(a);
        props.setCouleeEnCours(a);
    }

    useEffect(() => {
        fetchCouleeNum();
        fetchTransitionType();
    }, [])

    return (
        <div className='coulee-prod'>
            <h2>Coulées du jour</h2>
            {props.couleesDuJour.length === 0
                ? <div className='no-coulee-today'>
                    <strong> Aucune coulée programmée aujourd'hui </strong>
                </div>
                : (<div className='has-coulee-today'>
                    <div className='coulee-num'>
                        <label>Numéro de coulée</label>
                        <input
                            type='number'
                            id='start-num'
                            value={couleeNum}
                            onChange={changeCouleeNum} />
                    </div>

                    <div className='coulee-prod-table'>
                        <table>
                            <thead>
                                <tr>
                                    <th> Numéro de coulée </th>
                                    <th> Type </th>
                                    <th> Statut </th>
                                    <th> Nb blocs </th>
                                    <th> Actions </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.couleesDuJour.map((coulee) => (
                                        <tr key={coulee.id}>
                                            <td> {coulee.numero}{coulee.nom}</td>
                                            <td> {coulee.type.intitule} </td>
                                            <td> {renderingCouleeStatus(coulee.statut)} </td>
                                            <td>{coulee.nbBloc}</td>
                                            <td>
                                                {coulee.type.intitule === "TRANSITION"
                                                    ? null
                                                    : <div>
                                                        <BtnStartCoulee
                                                            coulee={coulee}
                                                            statutList={statutList}
                                                            startCoulee={startCoulee}
                                                            bool = {props.couleeEnCours.numero ? true : false}
                                                        />

                                                        {/*
                                                            <Button
                                                                variant='text'
                                                                color='success'
                                                                onClick={() => showStartDialog(coulee)}
                                                                disabled={coulee.statut === statutList[1] ? true : false}
                                                            >
                                                                Demarrer
                                                            </Button>
                                                            <Dialog open={boolStartCoulee}>
                                                                <DialogTitle>Souhaitez-vous démarrer la coulée <strong> {coulee.type.intitule} </strong> ?</DialogTitle>
                                                                <DialogActions>
                                                                    <Button onClick={() => startCoulee(coulee)}> Oui</Button>
                                                                    <Button onClick={hideStartDialog}> Annuler</Button>
                                                                </DialogActions>
                                                            </Dialog>*/}

                                                        <>
                                                            <Button
                                                                variant='text'
                                                                color='error'
                                                                onClick={() => endCoulee(coulee)}
                                                                disabled={(coulee.id === props.couleeEnCours.id && coulee.statut === statutList[1]) ? false : true}
                                                            >
                                                                Terminer
                                                            </Button>
                                                        </>
                                                        <BtnDeleteCoulee
                                                            coulee={coulee}
                                                            statutList={statutList}
                                                            deleteCoulee={deleteCoulee}
                                                        />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                </div>)
            }
            <div className='btn-coulee-prod'>
                <BtnAddCoulee />
                <div>
                    <button
                        onClick={showStartTransitionDialog}
                        disabled={props.couleeEnCours.numero ? false : true}
                    >
                        Démarrer transition
                    </button>
                    <Dialog open={boolStartTransition}>
                        <DialogTitle> Souhaitez-vous démarrer la transition <strong> {props.couleeEnCours.numero +"=>"}{Number(props.couleeEnCours.numero)+1} </strong> ? </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => { startTransition(); setBoolStartTransition(false) }}> Oui</Button>
                            <Button onClick={hideStartTransitionDialog}> Annuler</Button>
                        </DialogActions>
                    </Dialog>

                </div>
                <div>
                    <button
                        onClick={showEndTransitionDialog}
                        disabled={props.couleeEnCours.nom && props.couleeEnCours.statut === statutList[1] ? false : true}
                    >
                        Terminer transition
                    </button>
                    <Dialog open={boolEndTransition}>
                        <DialogTitle> Souhaitez-vous terminer la <strong> transition {props.couleeEnCours.nom} </strong> ? </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => {endTransition(); setBoolEndTransition(false)}}> Oui</Button>
                            <Button onClick={hideEndTransitionDialog}> Annuler</Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div>


        </div>
    );

}