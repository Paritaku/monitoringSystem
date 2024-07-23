import React from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useState } from 'react';
export default function BtnDeleteCoulee(props) {
    const [boolDeleteCoulee, setBoolDeleteCoulee] = useState(false);

    function showDeleteDialog() {
        setBoolDeleteCoulee(true);
    }
    function hideDeleteDialog() {
        setBoolDeleteCoulee(false);
    }

    return (
        <>
            <Button 
                variant='text' 
                color='warning'
                onClick={showDeleteDialog}
                disabled={!props.coulee.numero ? false : true}
            > 
                Supprimer 
            </Button>

            <Dialog open={boolDeleteCoulee}>
                <DialogTitle> Souhaitez-vous <strong>supprimer</strong> la <strong>coulée {props.coulee.type.intitule} </strong> ? </DialogTitle>
                <DialogActions>
                    <Button onClick={() => {props.deleteCoulee(props.coulee); setBoolDeleteCoulee(false)}}> Oui</Button>
                    <Button onClick={hideDeleteDialog}> Annuler</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
