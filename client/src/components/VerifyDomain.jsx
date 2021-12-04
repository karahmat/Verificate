import React, {useContext} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext } from '../App.js';

export default function VerifyDomain() {
    const userData = useContext(UserContext);
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            To verify your domain, create a blank text file with the filename: <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{userData?.walletAddress.slice(0,15)}.txt </Box>
             and publish it on: <Box component="span" sx={{ color: "secondary.main"}}>{userData?.domain}</Box>/
            <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{userData?.walletAddress.slice(0,15)}.txt</Box>
          </DialogContentText>          
        </DialogContent>
        <DialogActions>          
          <Button onClick={handleClose}>Verify Domain</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}