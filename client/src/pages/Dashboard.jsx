import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DeployPopup from '../components/DeployPopup';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

export default function Dashboard() {
    const [certificates, setCertificates] = useState([]);

    return (
        <Container sx={ {p: 2} }>
            <Typography variant="h3" component="h1" sx={{mb: 1.5}}>Dashboard</Typography>
            { certificates.length === 0 ? 
            <DeployPopup method="certificates" setCertificates={setCertificates} />
            : <Typography variant="h4" sx={{color: 'primary.main'}}>List of Certificates Issued</Typography>
            }
            <Container sx={{mt: 1.5}}>
            
            { certificates?.map((certificate, index) => (
                <Accordion key={`${certificate.hash}${index}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index+1}a-content`}
                        id={`panel${index+1}a-header`}
                    >
                        <Typography variant="body1">IPFS Hash: <Box component="span" sx={{ wordBreak: "break-all" }}>{certificate.hash}</Box></Typography>
                    </AccordionSummary>
                    <AccordionDetails>                        
                        <Typography variant="body1">Name: {certificate.name}</Typography>                        
                        <Typography variant="body1">ID: {certificate.studentID}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            </Container>
            
        </Container>
    )
}
