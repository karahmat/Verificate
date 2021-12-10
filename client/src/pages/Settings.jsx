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
            <Typography variant="h4" sx={{color: "primary.main"}}>List of Smart Contracts</Typography>
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
            <Box mt={3}>
                <Typography variant="h5" mb={2}>What is a Smart Contract?</Typography>
                <Typography variant="bodytext1">
                    A Smart Contract is a set of instructions coded in the Solidity programming language, allowing you to interact with the Ethereum blockchain. <br /><br />
                    Before you can interact with the blockchain, you need to Deploy the Smart Contract to the blockchain.<br/><br />
                    Here, we are giving you the option of deploying your Smart Contract on the local blockchain, the Rinkeby testnet (the first two for testing purposes) or the Main net. 
                    Please ensure you have enough Ether before deploying your Smart Contract. 
                </Typography>
            </Box>
        </Container>
    )
}
