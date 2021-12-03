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


export default function DeployPopup() {
    const userData = useContext(UserContext);               
    const [etherErrorMsg, setEtherErrorMsg] = useState();
    const [deployState, setDeployState] = useState({
        testnet: '',
        password: ''
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
        setOpen(false);
        const response = await fetch("/api/documents/deploy", {
            method: 'POST',
            headers: { 'content-type': 'application/json' },  
            body: JSON.stringify({
                userId: userData.userId, 
                testnet: deployState.testnet, 
                password: deployState.password
             })          
        });            

        const data = await response.json();
        
        if(data.data === "Success") {            
            window.location.assign('/submitDoc');
        } else if (data.errors) {                        
            setEtherErrorMsg(data.errors);
        }
    }


    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>Deploy</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To deploy your Smart Contract, you will need to re-enter your password.
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
                    id="password"
                    label="password"
                    type="password"
                    fullWidth
                    variant="standard"
                    name="password"
                    onChange={handleDeployInputChange}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeployment}>Deploy</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
