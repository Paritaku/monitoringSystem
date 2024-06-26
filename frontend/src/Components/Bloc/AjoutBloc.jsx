import React, { useEffect, useState } from 'react'
import './AjoutBloc.css'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, Stack, TextField } from '@mui/material'
import GenreDropdown from '../Genre/GenreDropdown';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const AjoutBloc = ({dialogState, setDialogState, update}) => {
    const CREATE_BLOC_URL = "http://localhost:8080/api/v1/bloc/create"
    const [blocSend, setBlocSend] = useState(false);

    //Usestate pour stocker la valeur du genre et ses modifications
    const [genreSelected, setGenreSelected] = useState({
            genreId: null,
            intitule: null
        });

    const [bloc, setBloc] = useState({
        blocId: null,
        blocName: "",
        genre: {
            genreId: null,
            intitule: null
        },
        blocDate: "",
        blocStatut: "",
        });
    
    const closeDialog = () => {
        setDialogState(false);
    }
    
    const changeBlocName = (e) => {
        setBloc(prevState => ({
            ...prevState,
            blocName: e.target.value
        }))
    }

    const addBloc = (e) => {
        setBloc(prevState => ({
            ...prevState,
            genre: {
                genreId: genreSelected.genreId,
                intitule: genreSelected.intitule
            },
            blocDate: getDate(),
            blocStatut: "INITIALISE",  
        }));
        setBlocSend(true);  
    }

    useEffect(() => {
        if(blocSend) {
            console.log(bloc)
            axios.post(CREATE_BLOC_URL, bloc).then((response) => {
                if(response.status){
                    update();
                }
            });
            setBlocSend(false);
        }
        }, [bloc])
    
    function getDate(){
        const instant = new Date();
        const year = instant.getFullYear();
        const month = String(instant.getMonth() + 1).padStart(2,'0');
        const day = String(instant.getDate()).padStart(2,'0');
        return year + "-" + month + "-" + day;
    }

    return (
        <div>
            <Dialog open={dialogState} fullWidth maxWidth="md">
                <DialogTitle> 
                    Creation d'un Bloc
                        <Icon style={{float: 'right'}} className='icon-close' onClick={closeDialog}> 
                            <CloseIcon color='error'></CloseIcon> 
                        </Icon>
                    
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField 
                            label="Nom du bloc" 
                            variant='outlined' 
                            required 
                            value={bloc.blocName} onChange={changeBlocName}>
                        </TextField>
                        <GenreDropdown 
                            genre={genreSelected} setGenre={setGenreSelected}
                             />
                        <Button color='primary' variant='contained' onClick={addBloc}> Ajouter bloc </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default AjoutBloc