import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Explore() {
    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }> 
            <Typography variant="h4" component="h1" sx={{mb: 1.5, mt: 1.5}}>What's this about?</Typography>            
            <Typography variant="body1">This app allows you to issue and store verifiable certificates in the Ethereum blockchain.</Typography>
            <Typography variant="h5" component="h2" sx={{mb: 1.5, mt: 1.5, color: "primary.main"}}>Get Started</Typography>            
            <Typography variant="body1" sx={{mb: 1.2}}>1. You need to register an account first by clicking on the Register button on the top right corner.</Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>2. After successful registration, a wallet address and smart phrase will be generated for you. Store this safely</Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>
            3. Thereafter, please ensure that you have enough Ether in your testnet.<br /><br />
            - For the Goerli testnet, you can go to a Goerli faucet to get your Ether.<br /><br />
            - For the localhost testnet, you can use Ganache or some testRPC library to generate the account on your localhost.<br /><br />
            </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>4. Then, deploy your smart contract. Every issuer will have a unique contract address. </Typography>
            <Typography variant="body1" sx={{mb: 1.2}}>5. To issue a certificate, go to Submit Document.</Typography>
        </Container>
    )
}
