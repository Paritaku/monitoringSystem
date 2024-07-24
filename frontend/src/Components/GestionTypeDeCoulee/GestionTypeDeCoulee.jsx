import React, { useEffect, useState } from 'react'
import "./GestionTypeDeCoulee.css"
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import danger from "../assets/danger.svg";

export function ModifierTypeBtn(props) {
    const [dialogState, setDialogState] = useState(false);
    const [intitule, setIntitule] = useState(props.type.intitule);
    const SAVE_TYPE_URL = "http://localhost:8080/api/v1/type/save";

    function showDialog() {
        setDialogState(true);
    }
    function hideDialog() {
        setDialogState(false);
    }
    function changeIntitule(event) {
        setIntitule(event.target.value);
    }
    async function saveType(type) {
        await axios.post(SAVE_TYPE_URL, type)
            .catch(error => console.log(error))
    }
    function modifierIntitule() {
        if (intitule !== "") {
            const a = {
                ...props.type,
                intitule: intitule
            }
            saveType(a);
            setDialogState(false);
            location.reload();
        }
    }

    return (
        <div>
            <Button
                variant='contained'
                color='primary'
                disabled={props.type.intitule === "TRANSITION" ? true : false}
                onClick={showDialog}
            >
                Modifier
            </Button>
            <Dialog open={dialogState}>
                <DialogTitle>Modification du type</DialogTitle>
                <DialogContent>
                    <input
                        type='text'
                        className='modification-input'
                        value={intitule}
                        onChange={changeIntitule}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={modifierIntitule}>Modifier</Button>
                    <Button onClick={hideDialog}>Annuler</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export function SupprimerTypeBtn(props) {
    const [dialogState, setDialogState] = useState(false);
    const [dialogState2, setDialogState2] = useState(false);
    //Si des coulées ont ce type dans la bb enrégistrées dans la bdd
    const [bool, setBool] = useState(false); 
    const DELETE_TYPE_URL = "http://localhost:8080/api/v1/type/delete/";

    function showDialog() {
        setDialogState(true);
    }
    function hideDialog() {
        setDialogState(false);
    }
    function hideDialog2() {
        setDialogState2(false);
    }

    async function deleteType() {
        try {
            await axios.delete(DELETE_TYPE_URL + props.type.id);

        } catch (error) {
            if (error.response) {
                return error.response.status;
            }
        }
    }
    async function supprimerType() {
        const a = await deleteType();
        if (a === 500) {
            setDialogState(false);
            setBool(true);
            setDialogState2(true);
        }
        else {
            setDialogState(false);
            location.reload();
        }


    }

    return (
        <div>
            <Button
                variant='contained'
                color='error'
                disabled={props.type.intitule === "TRANSITION" || bool ? true : false}
                onClick={showDialog}
            >
                Supprimer
            </Button>
            <Dialog open={dialogState}>
                <DialogTitle>Souhaitez-vous supprimer le <strong>type {props.type.intitule}</strong></DialogTitle>
                <DialogActions>
                    <Button onClick={supprimerType}>Supprimer</Button>
                    <Button onClick={hideDialog}>Annuler</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogState2}>
                <DialogContent >
                    <div className='delete-type-error'>
                        <img src={danger} alt="Error" />
                        <span> Vous ne pouvez pas supprimer le <strong>type {props.type.intitule} car certaines coulées possède ce type </strong> </span>
                        <img src={danger} alt="Error" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={hideDialog2}>Ok </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default function GestionTypeDeCoulee() {
    //
    const GET_ALL_TYPE_URL = "http://localhost:8080/api/v1/type/getAll";

    const SAVE_TYPE_URL = "http://localhost:8080/api/v1/type/save";

    const [typeList, setTypeList] = useState([]);

    const [addType, setAddType] = useState("");

    function changeAddType(event) {
        setAddType(event.target.value);
    }

    function boolAddType() {
        const foundType = typeList.find((type) => (type.intitule === addType));
        const bool1 = addType !== "" ? true : false;
        let bool2;
        if (foundType === undefined)
            bool2 = true;
        else
            bool2 = false;

        return bool1 && bool2;
    }
    async function saveType(type) {
        axios.post(SAVE_TYPE_URL, type)
            .catch(error => console.log(error))
    }
    function ajouterType() {
        const a = {
            intitule: addType
        }
        saveType(a);
        location.reload();
    }

    //
    async function fetchType() {
        axios.get(GET_ALL_TYPE_URL)
            .then(response => setTypeList(response.data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        fetchType()
    }, [])

    return (
        <div className='gestiontypedecoulee'>
            <h1>Liste des types</h1>
            <div className='gestiontypedecoulee-table'>
                {
                    typeList.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Intitule</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {typeList.sort((a, b) => a.id - b.id).map((type) => (
                                    <tr key={type.id}>
                                        <td> {type.id} </td>
                                        <td> {type.intitule} </td>
                                        <td className='gestiontypedecoulee-actions'>
                                            <ModifierTypeBtn
                                                type={type}
                                            />
                                            <SupprimerTypeBtn
                                                type={type}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td>
                                        <input
                                            type='text'
                                            className='gestiontypedecoulee-add-type'
                                            placeholder="Entrer l'intitule du type"
                                            value={addType}
                                            onChange={changeAddType}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            disabled={boolAddType() ? false : true}
                                            onClick={ajouterType}
                                        >
                                            Ajouter un type
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>)}
            </div>

        </div>
    )
}
