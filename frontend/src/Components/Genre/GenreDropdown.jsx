import React, { useEffect, useState } from 'react'
import './GenreDropdown.css'
import axios from 'axios'

const GenreDropdown = ({genre, setGenre}) => {
    const GET_ALL_GENRE_URL = "http://localhost:8080/api/v1/genre/getAll";
    const[listGenre, setListGenre] = useState([]);

    useEffect(() => {
        const fetchListGenre = async () => {
            const {data} = await axios.get(GET_ALL_GENRE_URL);
            setListGenre(data);
        }
        fetchListGenre();
    },[]);

    useEffect(() => {
        console.log(genre);
      }, [genre.Id]);

    const getGenre = (e) => {
        const val = listGenre.find((genre) => genre.genreId == e.target.value)
        setGenre(prevState => ({
            genreId: val.genreId,
            intitule: val.intitule
        }));
    }

    return (
        <div>
            <select name='genre' onChange={getGenre}>
                <option value="" > Choisir un genre </option>
                {
                    listGenre.map((genre) => (
                        <option key={genre.genreId} value={genre.genreId}>
                            {genre.intitule}
                        </option>
                    ))}
            </select>
        </div>
    )
}
export default GenreDropdown