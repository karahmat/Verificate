import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Explore() {
    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }> 
            <Typography variant="h4" component="h1" sx={{mb: 1.5, mt: 1.5}}>What's this about?</Typography>            
            <Typography variant="body1">This app allows you to issue and store verifiable certificates in the Ethereum blockchain.</Typography>
            <Typography variant="h5" component="h2" sx={{mb: 1.5, mt: 1.5, color: "primary.main"}}>Getting Started</Typography>            
            <Typography variant="body1" sx={{mb: 1.2}}>You need to Register an account first and get a wallet address and smart phrase. 
            Thereafter, please ensure that you have enough Ether in your testnet.
            For the Rinkeby testnet, you can go to a Rinkeby faucet to get your Ether.
            </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>Then, deploy your smart contract. Every issuer will have a unique contract address. </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>To issue a certificate, go to Submit Document.</Typography>
        </Container>
    )
}
