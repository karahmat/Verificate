import React, {useContext, useState, useReducer} from 'react';
import {styled} from '@mui/material/styles';
import {reducer} from '../utils/reducer';
import { UserContext } from '../App.js';

//Material UI components
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import LinearProgress from '@mui/material/LinearProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

//own components
import DeployPopup from '../components/DeployPopup';
import AboutSubmit from '../components/AboutSubmit';

const FormTextField = styled(TextField)(() => ({
    width: "100%",
    marginBottom: "10px"
}));

const initialState = {    
    testnet: '',
    studentFile: '',
    studentId: '',
    studentEmail: '',
    studentName: ''        
};  

export default function SubmitDoc() {
    const userData = useContext(UserContext);           
    const [errors, setErrors] = useState({});
    const [etherErrorMsg, setEtherErrorMsg] = useState('');
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [isUploading, setIsUploading] = useState(false);
   

    const handleInputChange = (inputEvent) => {

        if (inputEvent.target.name === "studentFile") {
            dispatch({
                type: "update",
                payload: {
                    field: 'studentFile',
                    value: inputEvent.target.files[0]
                }
            });  
        } else {
            dispatch({
                type: "update",
                payload: {
                    field: inputEvent.target.name,
                    value: inputEvent.target.value
                }
            });               
        }
    }

    const findFormErrors = () => {
        const {studentId, studentEmail, studentName, privateKey} = formInputs;
        const newErrors = {};
        const verifyEmail = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;        
        // email error
        if ( !studentEmail || studentEmail === '' ) {
            newErrors.studentEmail = 'cannot be blank!'
            newErrors.studentEmailError = true;
        } else if ( verifyEmail.test(studentEmail) === false ) {
            newErrors.studentEmail = 'not a valid email address';
            newErrors.studentEmailError = true;
        }

        // studentId error
        if ( !studentId || studentId === '' ) {
            newErrors.studentId = 'cannot be blank!'; 
            newErrors.studentIdError = true;
        }

        // studentName error
        if ( !studentName || studentName === '' ) {
            newErrors.studentName = 'cannot be blank!'; 
            newErrors.studentNameError = true;
        }

        // password error
        if ( !privateKey || privateKey === '' ) {
            newErrors.privateKey = 'cannot be blank!'; 
            newErrors.privateKeyError = true;
        } else if ( privateKey.length < 16 ) {
            newErrors.privateKey = 'password must be at least 16 characters long';
            newErrors.privateKeyError = true;
        }

        return newErrors;
    }

    const handleSubmit = async (e) => {                  
        
        e.preventDefault();         
        setErrors({});
        setEtherErrorMsg("");         
        // get our new errors
        const newErrors = findFormErrors();
        
        if (Object.keys(newErrors).length > 0) {
            //We've got errors on the front end
            setErrors(newErrors);
        } else {
            const formData = new FormData();

            for (const [key, value] of Object.entries(formInputs)) {                                
                formData.append(key, value);
            }            

            setIsUploading(true);
            const response = await fetch(`/api/documents/new`, {
                method: 'POST',                
                body: formData
            })
            const data = await response.json();
            
            if (data.data === "Success") {
                setIsUploading(false);                
                window.location.assign(`/dashboard`);
                // redirect user to /posts
            } else if (data.dataError) {                
                setEtherErrorMsg(data.dataError);
                setIsUploading(false);   
            }
        }
        
    };


    return (
                
        <Container sx={ {p: 2} }>
            <Typography variant="h3" component="h1">Submit your document here</Typography>
            {userData.userId === "" && (
                <h4>Please log in first</h4>
            )}
            
            {userData.userId !== "" && userData.contractAddress.length === 0 && (
                <>
                <Typography variant="h6" color="error.main">Please deploy your contract first</Typography>
                <DeployPopup method="deploy" />
                </>
            )}
           
            
            {userData.userId !== "" && userData.contractAddress.length > 0 && (
                
                <>
                <Typography sx={{mt:2, mb:1.2}}>List of Smart Contracts</Typography>
                { userData.contractAddress.map(contract => 
                        
                        <Box sx={{ display:"flex", alignItems: "center" }}>
                            <Typography sx={{mr: 2}}>{contract.nameOfNet}:    </Typography>
                            <Box component="p" sx={{ wordBreak: "break-all", color: "error.main" }}>{contract.address}</Box>
                        </Box>
                        
                )}
                

                <form noValidate autoComplete="off">
                    <FormControl variant="filled" color="success" fullWidth margin="normal" sx={{maxWidth: "300px"}}>
                        <InputLabel id="testnet">Ethereum Network</InputLabel>
                        <Select
                        labelId="ethNetwork"
                        id="ethNetwork"
                        name="testnet"
                        required
                        value={formInputs.testnet}
                        label="Ethereum Network"
                        onChange={handleInputChange}
                        >
                            <MenuItem value="localhost">Localhost</MenuItem>
                            <MenuItem value="rinkeby">Rinkeby</MenuItem>
                            <MenuItem value="mainnet">Mainnet</MenuItem>                        
                        </Select>
                    </FormControl>                  
                    <FormTextField id="file-input" name="studentFile" accept=".pdf" variant="outlined" type="file" required onChange={handleInputChange} />
                    <FormTextField id="studentId-input" name="studentId" label="Enter Student Id" type="text" helperText={ errors?.studentId !== "" ? errors.studentId : ""}  required onChange={handleInputChange} error={errors?.studentIdError} />
                    <FormTextField id="email-input" name="studentEmail" label="Enter Student's Email" variant="outlined" type="email" required onChange={handleInputChange} helperText={ errors?.studentEmail !== "" ? errors.studentEmail : ""} error={errors?.studentEmailError} />                    
                    <FormTextField id="studentName-input" name="studentName" label="Enter Student Name" type="text" helperText={ errors?.studentName !== "" ? errors.studentName : ""} required onChange={handleInputChange} error={errors?.studentNameError} />                
                    <FormTextField id="privateKey-input" name="privateKey" label="Enter your private key" type="password" helperText={ errors?.privateKey !== "" ? errors.privateKey : ""} required minLength="16" onChange={handleInputChange} error={errors?.privateKeyError} />                

                    { (etherErrorMsg?.ether !== '') && <Typography variant="p" sx={{ color: 'error.main' }}>{etherErrorMsg?.ether}</Typography>}
                    { isUploading === false && (
                    <Button variant="contained" endIcon={<SendIcon />} type="submit" onClick={handleSubmit}>Submit</Button>                        
                    )}
                    { isUploading && (
                        <LinearProgress />                        
                    )}
                </form>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Please ensure that you have at least 0.01 Ether in your account, before you click on Submit.</Typography>
                { etherErrorMsg !== '' && <Typography variant="subtitle2" color="error.main" ml={1.2} mr={1.1} mb={1.2}>{etherErrorMsg}</Typography>}
                </>
            )}
            <AboutSubmit />
        </Container>
        
    )
}
