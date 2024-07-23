import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export default function BtnStartCoulee(props) {
    const [boolStartCoulee, setBoolStartCoulee] = useState(false);

    function showStartDialog() {
        setBoolStartCoulee(true);
    }
    function hideStartDialog() {
        setBoolStartCoulee(false);
    }
    useEffect(() => {
        console.log();
    },[])
    return (
        <>
            <Button
                variant='text'
                color='success'
                onClick={() => showStartDialog()}
                disabled={!props.bool && props.coulee.statut === props.statutList[0] ? false : true}
            >
                Demarrer
            </Button>

            <Dialog open={boolStartCoulee}>
                <DialogTitle> Souhaitez-vous <strong>démarrer</strong> la <strong>coulée {props.coulee.type.intitule} </strong> ? </DialogTitle>
                {<DialogActions>
                    <Button onClick={() => {props.startCoulee(props.coulee); setBoolStartCoulee(false)}}> Oui</Button>
                    <Button onClick={hideStartDialog}> Annuler</Button>
                </DialogActions>}
            </Dialog>
        </>
    )
}
