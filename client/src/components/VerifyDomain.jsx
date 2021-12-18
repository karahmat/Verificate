import React, {useState, useContext} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext } from '../App.js';

export default function VerifyDomain({setVerifyAlert}) {
  const userData = useContext(UserContext);
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleVerify = async() => {
    //verify must be done through the backend to prevent CORS warning!

    try {
      
      const domainToCheck = userData.domain + "/" + userData.walletAddress.slice(0,15) + ".txt";
      const response = await fetch("/api/domain/verify", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({domainToCheck, domainKey: userData.walletAddress.slice(0,15)})
      }); 
      const data = await response.json();
      
      if (data.data !== "") {
          console.log(data.data);
          // data.data will either be "Verification successful" or "Verification failed"
          setVerifyAlert(data.data);
          setOpen(false);
          window.location.assign('/profile');
      }

    } catch (err) {
          console.log(err);
    }    
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Verify Domain
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Verify Domain</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The domain in your profile is not yet confirmed. 
            To verify your domain, create a text file with the filename: <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{userData?.walletAddress.slice(0,15)}.txt </Box>, 
            insert the text: <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{userData?.walletAddress.slice(0,15)}</Box> in the .txt file,
             and publish it on: <Box component="span" sx={{ color: "secondary.main"}}>{userData?.domain}</Box>/
            <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{userData?.walletAddress.slice(0,15)}.txt.</Box> 
            Thereafter, click on Verify Domain.
          </DialogContentText>          
        </DialogContent>
        <DialogActions>          
          <Button variant="contained" onClick={handleVerify}>Verify Domain</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}