import React from 'react';
import {useLocation} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SendPhrase() {  
    const location = useLocation();

    return (
        <Container maxWidth="sm" sx={ {p: 2.0, margin: "20px auto" } }>
            <Typography variant="h3" component="h1" sx={{ mb: 2}}>You are now registered</Typography>
            <Typography variant="h6" sx={{ mb: 2, }}>Please store your secret phrase securely. You will need this to recover your wallet</Typography>
            <Typography variant="p" sx={{ mb: 2, color: "secondary.main"}}>{ location.state }</Typography>            
        </Container>
    )
}
