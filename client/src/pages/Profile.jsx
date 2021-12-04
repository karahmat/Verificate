import React, { useContext } from 'react';
import { UserContext } from '../App.js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function Profile() {
    const userData = useContext(UserContext);
    return (
        <Container maxWidth="sm" sx={ {p: 2.0, margin: "20px auto" } }>
            <h1>This is my profile page</h1>
            <Typography variant="body1" sx={{mb: 2}}>Email: {userData.email}</Typography>
            <Typography variant="body1" sx={{mb: 2}}>Name of instituition: {userData.issuer}</Typography>
            <Typography variant="body1" sx={{mb: 2}}>Domain: {userData.domain}
                { userData.domainValidated ? <CheckCircleIcon color="success" /> : <CancelOutlinedIcon color="warning" />  }
            </Typography>            
            <Typography variant="body1" sx={{mb: 2, wordBreak: "break-all"}}>Wallet Address: {userData.walletAddress}</Typography>
            
            {/* {userData.contractAddress === "" && (
                <>
                <Typography variant="p">Please deploy your smart contract first before you can submit any document.</Typography>
                <Typography variant="p">However, please make sure you have enough Ether.</Typography>
                { (etherErrorMsg.ether !== "") && <Typography variant="p" sx={{ color: 'error.main' }}>{etherErrorMsg.ether}</Typography>}                
                <Button onClick={handleDeployment}>Deploy</Button>
                </>
                
            )} */}
        </Container>
    )
}
