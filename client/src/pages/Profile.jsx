import React, { useContext, useState } from 'react';
import { UserContext } from '../App.js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Box from '@mui/material/Box';
import VerifyDomain from '../components/VerifyDomain';
import Alert from '@mui/material/Alert';

export default function Profile() {
    const userData = useContext(UserContext);
    const [verifyAlert, setVerifyAlert] = useState("");
    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }>
            <h1>Profile Page</h1>
            <Typography variant="body1" sx={{mb: 2}}>Email: {userData.email}</Typography>
            <Typography variant="body1" sx={{mb: 2}}>Name of instituition: {userData.issuer}</Typography>
            <Box sx={{ display:"flex", alignItems: "flex-start", flexWrap: "wrap", mb: 2 }}> 
            <Typography variant="body1" sx={{mr: 1.2}}>Domain: {userData.domain}</Typography>
                { userData.domainValidated ? 
                <CheckCircleIcon color="success" /> :
                    <>                
                    <CancelOutlinedIcon color="warning" />
                    <VerifyDomain setVerifyAlert={setVerifyAlert} />
                    </>
               }
               { verifyAlert !== "" && 
                <Alert severity="info">{verifyAlert}</Alert>

               }
            </Box>            
            
            
        </Container>
    )
}
