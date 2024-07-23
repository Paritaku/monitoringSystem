import React, { useEffect, useState } from 'react'
import "./Production.css"
import axios from 'axios';
import DailyCouleeList, { timeToSeconds } from '../DailyCouleeList/DailyCouleeList';
import CouleeDisplay from '../CouleeDisplay/CouleeDisplay';
import { Autocomplete, TextField } from '@mui/material';

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

    return (
        <div>
            {couleesPerDates.map((coulee) => (
                <CouleeDisplay
                    key={coulee.id}
                    coulee={coulee} />
            ))}
        </div>
    )
}

export default function Production() {
    //Var pour stocker la liste des dates où une coulée a été enrégistrée
    const [listDateProd, setlistDateProd] = useState([]);
    //
    const LIST_DATE_PROD_URL = "http://localhost:8080/api/v1/coulee/getDateList";

    //Pagination
    const number = [...Array(listDateProd.length + 1).keys()].slice(1);
    const [currentPage, setCurrentPage] = useState(1);

    function prevPage() {
        if (currentPage > 1)
            setCurrentPage(Number(currentPage) - 1);
    }
    function nextPage() {
        if (currentPage < listDateProd.length)
            setCurrentPage(Number(currentPage) + 1);
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
        console.log(currentPage);
    }, [currentPage])

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
                                Production du {listDateProd[currentPage - 1]}
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

