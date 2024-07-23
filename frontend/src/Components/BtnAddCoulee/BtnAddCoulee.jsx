import React, { useEffect, useState } from "react";
import CouleeTypeDropdown from "../CouleeTypeDropdown/CouleeTypeDropdown";
import { Button, Dialog, DialogContent, DialogTitle, Icon, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

export default function BtnAddCoulee(){
    //List of different coulee's status
    const statutList = ["EN ATTENTE", "EN COURS", "TERMINE"]
    //API URL TO SAVE COULEE
    const CREATE_COULEE_URL = "http://localhost:8080/api/v1/coulee/save"
    //Variable to keep the coulee being saved
    const [coulee, setCoulee] = useState({
        id: null,
        numero: null,
        type: null,
        date: null,
        statut: null,
    })
    //Etat du dialog
    const [dialogState,setDialogState] = useState(false);
    //Showing dialog
    function toggleDialog(){
       setDialogState(!dialogState);
    }
    //Adding the coulee to database
    function addCoulee(){
        if(coulee.type.intitule) {
            axios.post(CREATE_COULEE_URL,{
                ...coulee,
                date: getDate(),
                statut: statutList[0]
            })
            .then(response => console.log(response.data))
            .catch(error => console.log(error))
        }
    }

    return(
        <div>
            <button onClick={toggleDialog}> Ajouter une coulée</button>
            <Dialog open={dialogState} fullWidth maxWidth="md">
                <DialogTitle> 
                    <span>Creation d'une coulée</span>
                    <Icon style={{float: 'right'}} className='icon-close' onClick={toggleDialog}> 
                        <CloseIcon color='error' />
                    </Icon>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <CouleeTypeDropdown
                            setCouleeType = {setCoulee}
                        />
                        <Button color='primary' variant='contained' onClick={addCoulee}> Ajouter </Button>
                        <Button color='error' variant='contained' onClick={toggleDialog}> Fermer </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    );
}

//Function pour créer une date au format YYYY-MM-DD
export function getDate(){
    const instant = new Date();
    const year = instant.getFullYear();
    const month = String(instant.getMonth() + 1).padStart(2,'0');
    const day = String(instant.getDate()).padStart(2,'0');
    return year + "-" + month + "-" + day;
}