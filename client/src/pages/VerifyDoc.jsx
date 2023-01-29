import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function VerifyDoc() {
    const { testnet, txnHash } = useParams();    
    const [certDetails, setCertDetails] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState();
    const [fileInput, setFileInput] = useState();
    
    const getTxnData = async() => {
        const response = await fetch(`/api/documents/verify/${testnet}/${txnHash}`, {
            method: 'GET',               
        });
        
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            setCertDetails(data);
        }
    }    

    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData();                                       
        formData.append("file", fileInput);        

        setIsUploading(true);
        const response = await fetch(`/api/documents/verifyIpfs`, {
            method: 'POST',                
            body: formData
        })
        const data = await response.json();
        
        if (data.ipfsHash) {
            setIsUploading(false); 
            if (data.ipfsHash === certDetails.documentHash) {
                setIpfsHash("The IPFS hash matches. The certificate has not been tampered with.");
            } else {
                setIpfsHash("The IPFS hash of the file you just uploaded does not match the one above");
            }
            // redirect user to /posts
        } else {                
            setIpfsHash("The file you uploaded cannot be found in the IPFS");
        }

    }

    useEffect(()=> {
        getTxnData();        
    }, []);

    return (
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto", boxShadow: 3 } }>
            <Typography sx={{mb:2, mt: 1.5}} variant="h4" component="h1">Verification of Certificate</Typography>
            <Typography sx={{mb:1.5}} variant="body1">This certificate was issued to <Box component="span" sx={{ color: "primary.main"}}>{certDetails.studentName} (Student ID: {certDetails.studentId})</Box> by <Box component="span" sx={{ color: "secondary.main"}}>{certDetails.issuerName}</Box>.</Typography>
            { certDetails?.domainValidated ? 
                <Typography sx={{mb:1.5}}>The issuer has been verified to be true.</Typography> : 
                <Typography sx={{mb:1.5}}>The issuer has not been verified.</Typography>
            }
            <Typography sx={{mb:1.5}} variant="body1">It has been stored on the Ethereum blockchain and has a IPFS hash of <Box component="span" sx={{ wordBreak: "break-all", color: "error.main" }}>{certDetails.documentHash}</Box> </Typography>
            
            <Typography sx={{mb:1.5}} variant="body1">To check whether the certificate (in PDF form) sent to you by the applicant has been tampered with, upload the PDF form below.</Typography>
            <form>
                <Box sx={{ display:"flex", alignItems: "center" }}>
                    <TextField sx={{ mr: 1.5 }} id="certificate-file" accept=".pdf" name="file" type="file" variant="outlined" required onChange={(e) => setFileInput(e.target.files[0])} />
                    { isUploading ? <CircularProgress color="success" /> : (                    
                    <Button variant="contained" color="success" type="submit" onClick={handleSubmit}>Submit</Button>
                    )}
                </Box>
            </form>
            { ipfsHash && 
                <Typography variant="body1" sx={{ mt: 1.5, color: "success.main", textAlign: "center"} }>{ ipfsHash }</Typography>
            }
        </Container>
    )
}
