import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CouleeTypeDropdown(props) {
    // URL de l'API*/
    const GET_ALL_GENRE_URL = "http://localhost:8080/api/v1/type/getAll";
    // Tableau pour stocker la liste des types depuis l'API
    const [listType,setListType] = useState([]);
    // Objet pour le type choisi
    const [typeChoisi, setTypeChoisi] = useState({
        id: undefined,
        intitule: undefined
    })
    //Retrieving list of types from API
    async function fetchListType() {
        await axios
            .get(GET_ALL_GENRE_URL)
            .then(response => {console.log(response.data); setListType(response.data)})
            .catch(error => console.log(error))
    }
    //Changing the type selected each time
    function setTypeSelected(event){
        const g = listType.find((genre) => genre.id == event.target.value);
        props.setCouleeType((prev) => ({
            ...prev,
            type: g
        }));
    }

    useEffect(() => {
        fetchListType();
    },[])

    return (
        <select name="genre" onChange={setTypeSelected}>
            <option value=""> Selectionnez un type de coulée... </option>
            {listType.map((genre) => (
                <option value={genre.id} key={genre.id}> {genre.intitule}</option>
            ))}
        </select>
  )
}
