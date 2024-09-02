import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./CouleeDisplay.css"
import SockJS from 'sockjs-client';
import danger from '../assets/danger.svg'
import { Client } from '@stomp/stompjs';
import excel_logo from '../assets/excel.svg';
import * as XLSX from 'xlsx-js-style';

export function camelCaseToTitleCase(text) {
    return text.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase()); // Met la première lettre en majuscule
}

export default function CouleeDisplay(props) {
    //URL où envoyer le get à l'api pour récupérer les blocs par coulées
    const GET_BLOCS_BY_COULEE_URL = "http://localhost:8080/api/v1/bloc/getBlocsByCouleeId/" + props.coulee.id;
    //
    const WEB_SOCKET_URL = "http://localhost:8080/ws";
    //
    const BLOC_PER_COULEE_SUBSCRIPTION_URL = "/topic/bloc/today/" + props.coulee.id

    //Use state pour stocker  les blocs par coulée
    const [listBlocs, setListBlocs] = useState([]);
    //function pour recupérer les blocs 
    function fecthListBlocs() {
        axios.get(GET_BLOCS_BY_COULEE_URL)
            .then(response => setListBlocs(response.data))
            .catch(error => console.log(error))
    }
    function rendenringComment(comment) {
        const splitComment = comment.split("!");
        return splitComment.map((comment) => (
            comment != "" &&
            <div className='comment-div'>
                <img src={danger} alt="danger" />
                <span>{comment}</span>
            </div>
        ))
    }
    
    function generateReport() {
        const columnWidth = 18;
        const nbColonne = 11;
        const table = listBlocs.map((bloc) => {
            const temp = {
                numeroDeCoulee: bloc.coulee.numero || bloc.coulee.nom,
                Type: bloc.coulee.type.intitule,
                Date: bloc.coulee.date,
                NumeroDuBloc: bloc.numero,
                Longueur: bloc.longueur,
                Largeur: bloc.largeur,
                Hauteur: bloc.hauteur,
                Poids: bloc.poids,
                Densite: bloc.densite,
                HeureEnregistrement: bloc.heureEnregistrement,
                Commentaires: bloc.commentaire
            };
            return temp;
        });

        const ws = XLSX.utils.json_to_sheet(table);

        ws['!cols'] = [
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: columnWidth },
            { wch: 30 },
        ];
        ws['!rows'] = table.map((bloc, index) => {
            return index === 0 ? { hpx: 50 } : { hpx: 30 }
        });
        ws['!rows'].push({ hpx: 30 });


        const headerStyle = {
            alignment: {
                wrapText: true,
                vertical: "center",
                horizontal: "center",
            },
            font: {
                bold: true,
                color: {
                    rgb: "444444"
                },
            },
            fill: {
                fgColor: {
                    rgb: "ffecb2"
                }
            },
        };

        const commentStyle = {
            font: {
                bold: true,
                color: {
                    rgb: "FFFFFF"
                },
                name: "Baskerville",
            },
            fill: {
                fgColor: {
                    rgb: "FB4F5D"
                }
            },
            border: {
                bottom: {
                    style: "thick",
                    color: {
                        rgb: "FFFFFF"
                    }
                }
            }
        };

        if (table.length) {
            /*Formattage header*/
            for (let i = 0; i < nbColonne; i++) {
                const cellAdress = XLSX.utils.encode_cell({ c: i, r: 0 });
                ws[cellAdress].v = camelCaseToTitleCase(ws[cellAdress].v);
                ws[cellAdress].s = headerStyle;
            }

            table.forEach((bloc, index) => {
                for (let i = 0; i < 11; i++) {
                    const cellAdress = XLSX.utils.encode_cell({ c: i, r: (index + 1) });
                    //Centrer le contenu à l'intérieur de toutes les cellules
                    ws[cellAdress].s = {
                        ...ws[cellAdress].s,
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                        }
                    }
                }
            })
            table.forEach((bloc, index) => {
                const cellAdress = XLSX.utils.encode_cell({ c: 10, r: (index + 1) });
                if (ws[cellAdress].v) {
                    for (let i = 0; i < 11; i++) {
                        const cellAdress2 = XLSX.utils.encode_cell({ c: i, r: (index + 1) });
                        ws[cellAdress2].s = {
                            ...ws[cellAdress2].s,
                            ...commentStyle,
                        }
                    }
                }
            })
        }

        const classeur = XLSX.utils.book_new();
        const name = props.coulee.numero ? `Coulee ${props.coulee.numero}` : `Transition ${props.coulee.nom}`;
        XLSX.utils.book_append_sheet(classeur, ws, name);
        XLSX.writeFile(classeur, name + ".xlsx");
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
            if (stompClient)
                stompClient.deactivate();
        }

    }, [])

    return (
        <div className='coulee-display'>
            <details>
                <summary
                    className={
                        props.coulee.type.intitule === "TRANSITION" ? props.coulee.type.intitule : props.coulee.statut.replace(/\s+/g, '-')
                    }
                >
                    {
                        (props.coulee.numero && ("Coulee " + props.coulee.numero)) ||
                        (props.coulee.nom && ("Transition " + props.coulee.nom))
                    }
                    <button title='Générer rapport' className='report-bouton' onClick={generateReport}>
                        <img src={excel_logo} />
                    </button>
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
                                    <td>{rendenringComment(bloc.commentaire)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </details>
        </div>
    )
}
