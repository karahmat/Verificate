import React, {useState, useContext} from 'react';
import { UserContext } from '../App.js';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export default function DeployPopup({method, setCertificates}) {
    console.log("Method: ", method);
    const userData = useContext(UserContext);               
    const [etherErrorMsg, setEtherErrorMsg] = useState('');
    const [deployState, setDeployState] = useState({
        testnet: '',
        privateKey: ''
    });
    
    
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeployInputChange = (event) => {
        setDeployState({
            ...deployState, 
            [event.target.name]: event.target.value
        })
    }

    const handleDeployment = async () => {
        
        const response = await fetch(`/api/documents/${method}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },  
            body: JSON.stringify({
                userId: userData.userId, 
                testnet: deployState.testnet, 
                privateKey: deployState.privateKey
             })          
        });            

        const data = await response.json();
        
        if(data.data === "Success") {     
            if (method === "deploy") {
                setOpen(false);
                window.location.assign('/submitDoc');
            } else {
                console.log(data.result);
                setCertificates(data.result);
                setOpen(false);
            }
        } else if (data.dataError) {                        
            setEtherErrorMsg(data.dataError);
        }
    }


    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>{method === "deploy" ? "Deploy" : "Load Certificates"}</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Smart Contract</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To deploy or interact with your Smart Contract, you will need to re-enter your password.
                </DialogContentText>
                <FormControl variant="filled" color="success" fullWidth margin="normal" sx={{maxWidth: "300px"}}>
                    <InputLabel id="testnet">Choose an ETH Network</InputLabel>
                    <Select
                    labelId="ethNetwork"
                    id="ethNetwork"
                    name="testnet"
                    value={deployState.testnet}
                    label="Ethereum Network"
                    onChange={handleDeployInputChange}
                    >
                        <MenuItem value="localhost">Localhost</MenuItem>
                        <MenuItem value="rinkeby">Rinkeby</MenuItem>
                        <MenuItem value="mainnet">Mainnet</MenuItem>                        
                    </Select>
                </FormControl>  
                <TextField
                    autoFocus
                    margin="dense"
                    id="privateKey"
                    label="Private Key"
                    type="password"
                    fullWidth
                    variant="standard"
                    name="privateKey"
                    onChange={handleDeployInputChange}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeployment}>{method === "deploy" ? "Deploy" : "Load Certificates"}</Button>
                </DialogActions>
                { etherErrorMsg !== '' && <Typography variant="subtitle2" color="error.main" ml={2} mr={1.1} mb={1.2}>{etherErrorMsg}</Typography>}
            </Dialog>
        </div>
    )
}
