import React, { useEffect, useState } from 'react'
import "./Production.css"
import axios from 'axios';
import DailyCouleeList, { timeToSeconds } from '../DailyCouleeList/DailyCouleeList';
import CouleeDisplay from '../CouleeDisplay/CouleeDisplay';
import { Autocomplete, TextField } from '@mui/material';
import * as XLSX from 'xlsx-js-style';

export function ProdCouleesPerDate(props) {
    const LIST_COULEES_PER_DATE_URL = "http://localhost:8080/api/v1/coulee/getCouleesPerDate/";
    const [couleesPerDates, setCouleesPerDates] = useState([]);

    async function fecthcouleesPerDate() {
        console.log(props.date)
        await axios.get(LIST_COULEES_PER_DATE_URL + props.date)
            .then(response => {
                const a = response.data.sort((a, b) => timeToSeconds(a.startTime) - timeToSeconds(b.startTime));
                setCouleesPerDates(a);
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {
        fecthcouleesPerDate();
    }, [])

    async function fetchListBlocs(couleeId) {
        const GET_BLOCS_BY_COULEE_URL = `http://localhost:8080/api/v1/bloc/getBlocsByCouleeId/${couleeId}`;
        try {
            const response = await axios.get(GET_BLOCS_BY_COULEE_URL);
            return response.data;
        } catch (error) {
            return console.log(error);
        }
    }

    function camelCaseToTitleCase(text) {
        return text.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase()); // Met la première lettre en majuscule
    }
    async function genererRapport() {
        const wb = XLSX.utils.book_new();

        for (const coulee of couleesPerDates.filter((coulee) => (coulee.nom || coulee.numero))) {
            const listBlocs = await fetchListBlocs(coulee.id);
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
            const name = coulee.numero ? `Coulee ${coulee.numero}` : `Transition ${coulee.nom}`;
            XLSX.utils.book_append_sheet(wb, ws, name);
        }
        XLSX.writeFile(wb, `Rapport de production du ${props.date}.xlsx`);
    }

    return (
        <div>
            {couleesPerDates.map((coulee) => (
                (coulee.numero || coulee.nom) &&
                    <CouleeDisplay
                    key={coulee.id}
                    coulee={coulee} />
            ))}
            <div className='final-report-btn'>
                <button onClick={genererRapport}>Générer Rapport</button>
            </div>
        </div>
    )
}

export default function Production() {
    //Var pour stocker la liste des dates où une coulée a été enrégistrée
    const [listDateProd, setlistDateProd] = useState([]);
    //
    const LIST_DATE_PROD_URL = "http://localhost:8080/api/v1/coulee/getDateList";

    const [currentPage, setCurrentPage] = useState(1);

    //
    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState("");

    //Pagination
    const number = [...Array(listDateProd.length + 1).keys()].slice(1);

    function prevPage() {
        if (currentPage > 1) {
            setCurrentPage(Number(currentPage) - 1);
        }

    }
    function nextPage() {
        if (currentPage < listDateProd.length) {
            setCurrentPage(Number(currentPage) + 1);
        }
    }
    function goToPage(n) {
        setCurrentPage(n);
    }

    async function fecthListDateProd() {
        await axios.get(LIST_DATE_PROD_URL)
            .then(response => {
                if (response.data) {
                    setlistDateProd(response.data);
                }
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        fecthListDateProd();
    }, [])

    useEffect(() => {
        listDateProd.length > 0 && setValue(listDateProd[0])
    }, [listDateProd])

    useEffect(() => {
        listDateProd.length > 0 && setValue(listDateProd[currentPage - 1]);
    }, [currentPage])

    useEffect(() => {
        if (value !== "" && value !== undefined && value != null) {
            setCurrentPage(listDateProd.indexOf(value) + 1);
        }
    }, [value])

    /*useEffect(() => {
        if (inputValue === "") {
            setCurrentPage(1);
        }
    }, [inputValue])*/

    return (
        <div className='production'>
            <button
                onClick={prevPage}
                className="pagination-btn-previous pagination-btn"
                disabled={currentPage === 1 ? true : false}
            >
                &lt;
            </button>
            <div className='production-table'>
                {
                    listDateProd.length > 0 && (
                        <div>
                            <h2>
                                Production du
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={listDateProd}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => {
                                        setInputValue(newInputValue);
                                    }}
                                    sx={{ width: 200 }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </h2>
                            <ProdCouleesPerDate
                                date={listDateProd[currentPage - 1]}
                                key={listDateProd[currentPage - 1]}
                            />
                        </div>

                    )
                }
            </div>

            <button
                onClick={nextPage}
                className="pagination-btn-next pagination-btn"
                disabled={currentPage === listDateProd.length || listDateProd.length === 0 ? true : false}
            >
                &gt;
            </button>

        </div>
    )
}

