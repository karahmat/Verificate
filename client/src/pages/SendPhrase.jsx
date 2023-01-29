import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function SendPhrase() {  
    const location = useLocation();
    const [txtFile, setTxtFile] = useState(null);

    useEffect(() => {
        let text = 
        `These are your wallet addresses and keys:
        
Mnemonic: ${location.state.mnemonic}
        
Wallet Addresses:
${location.state.addresses.map((address) => "\n"+address)}

Private Keys:
${location.state.privateKeys.map((key) => "\n"+key)}`;
        
        const data = new Blob([text], {type: 'text/plain'});
        setTxtFile(window.URL.createObjectURL(data));
    }, []);

    return (
        <Container maxWidth="sm" sx={ {p: 2.0, margin: "20px auto" } }>
            <Typography variant="h3" component="h1" sx={{ mb: 2}}>You are now registered</Typography>
            <Typography variant="h6" sx={{ mb: 2, }}>Please store your secret phrase securely. You will need this to recover your wallet in Metamask or other wallet apps.</Typography>                       
            <Typography variant="body1" sx={{ mb: 2.5, color: "secondary.main"}}>{ location.state.mnemonic }</Typography>
            <Typography variant="h4" sx={{ mb: 2, }}>Wallet Addresses and Keys</Typography> 
            <Typography variant="body1" sx={{ mb: 2 }}>Listed below are your wallet addresses and private keys. Please save these securely in your local drive. Once you exit this page, your mnemonic and private keys will be gone.</Typography>
            
            <Typography variant="h6">Wallet addresses: </Typography>
            
            { location.state.addresses?.map( (address, index) => (
                <Typography key={address} variant="body2">{index+1}. {address}</Typography>
            ))}

            <Typography variant="h6" sx={{ mt: 2 }}>Private keys :</Typography>
            { location.state.privateKeys?.map( (key, index) => (
                <Typography key={key} variant="body2" sx={{wordBreak: "break-all"}}>{index+1}. {key}</Typography>
            ))}

            <Typography variant="body1" sx={{mt:2, mb: 2}}>Click on the button below to download a .txt file of your wallet addresses and private keys.</Typography>
            
            { txtFile && (
                <Button href={txtFile} download="verificateKeys.txt" variant="contained" endIcon={<FileDownloadIcon />}>Download Keys</Button>
            )}
            <Typography variant="subtitle2" sx={{mt:2}}>You can also create more addresses and private keys through the mnemonic above using apps like <a href="https://allprivatekeys.com/mnemonic-code-converter">All Private Keys</a>.</Typography>
        </Container>
    )
}
