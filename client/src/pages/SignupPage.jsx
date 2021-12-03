import React, {useReducer, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import LinearProgress from '@mui/material/LinearProgress';
import {reducer} from '../utils/reducer';

const FormTextField = styled(TextField)(() => ({
    width: "100%",
    marginBottom: "10px"
}));

const initialState = {    
    email: '',
    password: '',
    domain: '', 
    issuer: '',
  };  

export default function SignupPage( {login, setLogin} ) {
    const history = useHistory();
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [errors, setErrors] = useState({});    
    const [backEndErrorMsg, setBackEndErrorMsg] = useState({
        email: ''        
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (inputEvent) => {
        dispatch({
          type: "update",
          payload: {
            field: inputEvent.target.name,
            value: inputEvent.target.value
          }
        })
      }
    
    const findFormErrors = () => {
        const {email, password, domain, issuer} = formInputs;
        const newErrors = {};
        const verifyEmail = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;        
        // email error
        if ( !email || email === '' ) {
            newErrors.email = 'cannot be blank!'
            newErrors.emailError = true;
        } else if ( verifyEmail.test(email) === false ) {
            newErrors.email = 'not a valid email address';
            newErrors.emailError = true;
        }

        // password error
        if ( !password || password === '' ) {
            newErrors.password = 'cannot be blank!'; 
            newErrors.passwordError = true;
        } else if ( password.length < 8 ) {
            newErrors.password = 'password must be at least 8 characters long';
            newErrors.passwordError = true;
        }

        if (!domain || domain === '') {
            newErrors.domain = 'cannot be blank!';
            newErrors.domainError = true;
        } else if (domain.slice(0,5).includes("http") === false) {
            newErrors.domain = 'domain must start with http or https';
            newErrors.domainError = true;
        }

        if (!issuer || issuer === '') {
            newErrors.issuer = 'cannot be blank!';
            newErrors.issuerError = true;
        }

        return newErrors;
    }
    
    const handleSubmit = async (e) => {                  
        
        e.preventDefault();
        
        setErrors({}); 
        setBackEndErrorMsg({});
        // get our new errors
        const newErrors = findFormErrors()
        
        if (Object.keys(newErrors).length > 0) {
            //We've got errors on the front end
            setErrors(newErrors);
        } else {
            setIsLoading(true);
            const response = await fetch("/api/users/signup", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formInputs)
            });            
            const data = await response.json();
            console.log(data);   
            if(data.data === "Success") { 
                console.log(login);                              
                setLogin(true);  
                setIsLoading(false);
                                
                history.push({ 
                    pathname: '/sendPhrase',
                    state: data.dataMnemonic,
                }); 
            
                
            } else if (data.errors) { 
                setIsLoading(false);                       
                setBackEndErrorMsg(data.errors);
            }
        }
        
    };

    return (        
        <Container sx={ {p: 2} }>
            <Typography variant="h4">Create a Profile</Typography>
            <Typography variant="h6" sx={{ mb: 2}}>Please enter the following data</Typography>
            <form noValidate autoComplete="off">                
                <FormTextField id="email-input" name="email" label="Enter email" variant="outlined" type="email" required onChange={handleInputChange} helperText={ errors?.email !== "" ? errors.email : ""} error={errors?.emailError} />
                { backEndErrorMsg.email !== '' && <Typography variant="p" sx={{ marginBottom: "15px", color: 'error.main' }}>{backEndErrorMsg.password}{backEndErrorMsg.email}</Typography>}                
                
                <FormTextField id="password-input" name="password" label="Set password" type="password" autoComplete="current-password" required minLength="8" onChange={handleInputChange} helperText={ errors?.password !== "" && errors?.password !== undefined ? errors.password : "Password must be 8 characters long"}  error={errors?.passwordError} />                
                <FormTextField id="domain-nput" name="domain" label="Enter domain" variant="outlined" helperText={ errors?.domain !=="" && errors?.domain !== undefined ? errors.domain : "Enter the domain of your organisation (including http:// or https://)"} required onChange={handleInputChange} error={errors?.domainError}/>
                <FormTextField id="issuer-input" name="issuer" label="Enter Name of Instituition" variant="outlined" required onChange={handleInputChange} helperText={ errors?.issuer !== "" && errors?.issuer !== undefined ? errors.issuer : ""} error={errors?.issuerError}  />
                { isLoading ? (
                    <LinearProgress />
                ) : (
                    <Button variant="contained" endIcon={<SendIcon />} type="submit" onClick={handleSubmit}>Submit</Button>
                ) }
            </form>
        </Container>        
    )
}
