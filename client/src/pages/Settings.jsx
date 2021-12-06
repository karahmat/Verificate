import React, {useContext} from 'react';
import { UserContext } from '../App.js';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DeployPopup from '../components/DeployPopup';
import Box from '@mui/material/Box';

export default function Settings() {
    const userData = useContext(UserContext);
    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }>
            <Typography variant="h5" sx={{color: "primary.main"}}>List of Smart Contracts</Typography>
            {userData.userId !== "" && userData.contractAddress.length === 0 && (
                
                <Typography variant="h6" color="error.main">You do not have any Smart Contract. Please deploy your contract first</Typography>                
                
            )}

            {userData.userId !== "" && userData.contractAddress.length > 0 && (
                <>                  
                { userData.contractAddress.map(contract => 
                        
                <Box sx={{ display:"flex", alignItems: "center" }}>  
                    <Typography variant="body1" sx={{ mr: 1.5}}>{contract.nameOfNet}:</Typography>
                    <Box component="p" sx={{ wordBreak: "break-all", color: "error.main" }}>{contract.address}</Box>
                </Box>

                )}
                </>                
            )}
            <DeployPopup method="deploy" />
        </Container>
    )
}
