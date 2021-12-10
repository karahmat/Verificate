import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DoubleArrow from '@mui/icons-material/DoubleArrow';

export default function AboutSubmit() {
    const whatActuallyHappens = [
        "The certificate will be stored in the Interplanetary File System (IPFS) and a unique document hash will be generated. The IPFS gives you the same hash, if you submit the same document.",
        "Thereafter, the document hash and your instituition's name, as well as the student ID and name, will be digitally signed and stored in the Ethereum blockchain.",
        "The storing of data into the blockchain constitutes a transaction and gas (a fraction of an Ether) is needed. Once the block of data is successfully stored into the blockchain, a unique transaction ID is generated.",
        "The transaction ID and certificate will be sent to the student's email. A link, as well as a QR code, which directs any user to the verification page, will also be sent to the student.",
        "If the student needs his/her credentials to be verified, he/she can forward the whole email to the employer."
    ]
    return (
        <Box mt={2}>
            <Typography variant="h5" color="darkblue" sx={{fontWeight: "bold"}}>What happens when you click on Submit?</Typography>
            <List>
            { whatActuallyHappens.map((reason) => (
            <ListItem>
                <ListItemIcon>
                    <DoubleArrow />
                </ListItemIcon>
                <ListItemText >
                    <Typography sx={{fontSize: "1.1rem"}}>{reason}</Typography>
                </ListItemText>
            </ListItem>  
            ))}  
        </List>
        </Box>
    )
}
