import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Explore() {
    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }> 
            <Typography variant="h4" component="h1" sx={{mb: 1.5, mt: 1.5}}>What's this about?</Typography>            
            <Typography variant="body1">This app allows you to issue and store verifiable certificates in the Ethereum blockchain.</Typography>
            <Typography variant="h5" component="h2" sx={{mb: 1.5, mt: 1.5, color: "primary.main"}}>Getting Started</Typography>            
            <Typography variant="body1" sx={{mb: 1.2}}>You need to register an account first by clicking on the Register button on the top right corner.</Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>After successful registration, a wallet address and smart phrase will be generated for you. Store this safely</Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>
            Thereafter, please ensure that you have enough Ether in your testnet.
            For the Rinkeby testnet, you can go to a Rinkeby faucet to get your Ether.
            For the localhost testnet, you can use Ganache or some testRPC library to generate the account on your localhost.
            </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>Then, deploy your smart contract. Every issuer will have a unique contract address. </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>To issue a certificate, go to Submit Document.</Typography>
        </Container>
    )
}
