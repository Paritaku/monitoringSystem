import React, { useEffect, useState } from "react";
import "./DailyProduct.css";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import pdf_icon from "../Assets/pdf-icon.svg";
import salidor from "../Assets/salidor.jpeg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from '@mui/material'

const DailyProduct = ({ newProduct, setNewProduct }) => {
    const GET_DAILY_PRODUCT_URL = "http://localhost:8080/api/v1/produit/getTodayProduct";
    const [produitEnregistreToday, setproduitEnregistreToday] = useState([]);
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    const DELETE_PRODUIT_URL = "http://localhost:8080/api/v1/produit/delete/"
    const blocEnCours = produitEnregistreToday.filter(
        (produit) => produit.bloc.blocStatut === "EN COURS"
    );
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const GET_BLOC_DU_JOUR_URL = "http://localhost:8080/api/v1/bloc/getTodayBloc";
    const [blocDuJour, setBlocDuJour] = useState([]);

    //Variable stocker la somme des valeurs
    const sum = {
        hauteur: produitEnregistreToday && produitEnregistreToday.reduce((somme, bloc) => somme + bloc.hauteur,0),
        longueur: produitEnregistreToday && produitEnregistreToday.reduce((somme, bloc) => somme + bloc.longueur,0),
        largeur: produitEnregistreToday && produitEnregistreToday.reduce((somme, bloc) => somme + bloc.largeur,0),
        poids: produitEnregistreToday && produitEnregistreToday.reduce((somme, bloc) => somme + bloc.poids,0),
        densite: produitEnregistreToday && produitEnregistreToday.reduce((somme, bloc) => somme + bloc.densite,0),
    }

    //Tableau de pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recordPerPage, setRecordPerPage] = useState(25);
    const lastIndex = currentPage * recordPerPage;
    const firstIndex = lastIndex - recordPerPage;
    const record = produitEnregistreToday.slice(firstIndex, lastIndex);
    const npPage = Math.ceil(produitEnregistreToday.length / recordPerPage);
    const number = [...Array(npPage + 1).keys()].slice(1);

    function prevPage() {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }
    function nextPage() {
        if (currentPage < npPage) setCurrentPage(currentPage + 1);
    }
    function goToPage(n) {
        setCurrentPage(n);
    }

    //Charger les produits enregistrés aujourd'hui
    const loadTodayProduct = async () => {
        const { data } = await axios.get(GET_DAILY_PRODUCT_URL);
        setproduitEnregistreToday(data);
    };
    const fetchBlocDuJour = async() => {
        const { data } = await axios.get(GET_BLOC_DU_JOUR_URL);
        return data;
    };
    const handleCheckboxChange = (event) => {
        setCheckboxChecked(event.target.checked);
    };
    async function countMatelas() {
        const data = await fetchBlocDuJour();
        return data.reduce((sum,bloc) => sum + bloc.nbMatelas, 0);
    }
    //Génération string date
    function getDate() {
        const instant = new Date();
        const year = instant.getFullYear();
        const month = String(instant.getMonth() + 1).padStart(2, "0");
        const day = String(instant.getDate()).padStart(2, "0");
        return year + "-" + month + "-" + day;
    }
    async function deleteProduct(id) {
        console.log(DELETE_PRODUIT_URL+id);
        const response = await axios.delete(DELETE_PRODUIT_URL + id);
    }
    //Génération du pdf
    async function printProd() {
        const data = await fetchBlocDuJour();
        const doc = new jsPDF('landscape');
        const image = new Image();
        image.src = salidor;
        doc.addImage(image, "JPEG", 0, 0);

        const title = "Rapport de production du " + getDate();
        const titleY = doc.getImageProperties(image).height + 5;
        const titleWidth = doc.getTextWidth(title);
        const titleX = doc.internal.pageSize.width / 2 - titleWidth / 2;
        doc.text(title, titleX, 45);
        let bodyWithTotal;

        if(data) {
            console.log(data)
            bodyWithTotal = [
                ...data.map((bloc, i) => [
                    bloc.blocName,
                    bloc.genre.intitule,
                    bloc.nbMatelas,
                    bloc.blocDate,
                    bloc.blocStatut,
                ]),
                [
                    {
                        content: "Total",
                        colSpan: 4,
                        styles: { halign: "center", fontStyle: "bolditalic", fontSize: 15},
                    },
                    {
                        content: await countMatelas(),
                        styles: { halign: "center", fontStyle: "bolditalic", fontSize: 15},
                    },
                ],
            ];
        }
        const matelasBody = [
            ...produitEnregistreToday.map((produit) => [
                produit.longueur,
                produit.largeur,
                produit.hauteur,
                produit.poids,
                produit.densite,
                produit.bloc.genre.intitule,
                produit.bloc.blocName,
                produit.bloc.blocDate
            ]),
        ];

        //Premier tableau bilan de bloc
        doc.autoTable({
            head: [["Bloc Name", "Type", "Nombre de matelas", "Date", "Statut"]],
            body: bodyWithTotal,
            columnStyles: {
                halign: "center",
            },
            startY: doc.getTextDimensions(title).h + 45,
        });

        //Deuxième tableau bilan des matelas
        doc.autoTable({
            head:[["Longueur","Largeur","Hauteur","Poids","Densite","Genre", "Bloc", "Date"]],
            body: matelasBody,
            foot: [[
                sum.longueur,
                sum.largeur, 
                sum.hauteur, 
                sum.poids, 
                sum.densite,
                produitEnregistreToday.length + " matelas",
                data.length + " blocs",
                "BILAN",
             ]],
            columnStyles: {
                halign: "center",
            },
        })
        doc.save(getDate());
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
    }, []);

    useEffect(() => {
        console.log(checkboxChecked);
    }, [checkboxChecked]);

    useEffect(() => {
        
      },[blocDuJour])

    return (
        <div className="daily-product-container">
            <div className="daily-product-actions">
                <div>
                    <input type="checkbox" id="checkbox" onChange={handleCheckboxChange} />
                    <label for="checkbox">Afficher uniquement le bloc en cours</label>
                </div>
                <button onClick={printProd} className="print-daily-prod" title="Afficher la prod en pdf">
                    <img src={pdf_icon} alt="PDF icon" />
                </button>
            </div>
            <h1>Produit du jour </h1>
            <div>
                <table id="produit-table">
                    <thead>
                        <tr>
                            <th>Numero</th>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produitEnregistreToday.length > 0
                            ? record.map((produit) => (
                                <tr
                                    key={produit.id}
                                    className={
                                        produit.bloc.genre.intitule !== "TRANSITION"
                                            ? produit.bloc.blocStatut
                                            : produit.bloc.genre.intitule
                                    }
                                    style={{
                                        display:
                                            checkboxChecked &&
                                                produit.bloc.blocStatut !== "EN-COURS"
                                                ? "none"
                                                : "",
                                    }}
                                >
                                    <td>{produit.id}</td>
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
                                    <td><Button variant='contained' color='error' onClick={() => deleteProduct(produit.id)}> Supprimer  </Button> </td>
                                </tr>
                            ))
                            : null}
                        <tr className="sum-production-row">
                            <td>{produitEnregistreToday.length} matelas</td>
                            <td>{sum.longueur}</td> 
                            <td>{sum.largeur}</td>
                            <td>{sum.hauteur}</td>
                            <td>{sum.poids}</td>
                            <td>{sum.densite}</td>
                            <td colSpan={6} className="sum-row-title">Bilan de la prod</td>
                        </tr>
                    </tbody>
                </table>
                <div className="pagination-container">
                    <ul className="pagination">
                        <li className="pagination-item">
                            <a
                                href="#produit-table"
                                onClick={prevPage}
                                className="pagination-link"
                            >
                                Prev
                            </a>
                        </li>
                        {number.map((n) => (
                            <li
                                className={`pagination-item ${currentPage === n ? "active-page" : ""
                                    }`}
                            >
                                <a
                                    href="#produit-table"
                                    onClick={() => goToPage(n)}
                                    className="pagination-link"
                                >
                                    {n}
                                </a>
                            </li>
                        ))}
                        <li className="pagination-item">
                            <a href="#produit-table" onClick={nextPage}>
                                Next
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default DailyProduct;
