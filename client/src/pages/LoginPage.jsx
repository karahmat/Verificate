import React, {useState, useReducer, useEffect} from 'react';
import {reducer} from '../utils/reducer';
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import Link from '@mui/material/Link';


const FormTextField = styled(TextField)(() => ({
    width: "100%",
    marginBottom: "10px"
}));

const initialState = {    
    email: '',
    password: ''    
  };  

export default function LoginPage({setLogin}) {

    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [errors, setErrors] = useState({});    
    const [backEndErrorMsg, setBackEndErrorMsg] = useState({
        email: '',
        password: ''
    });

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
        const {email, password} = formInputs;
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
            const response = await fetch("/api/users/login", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formInputs)
            });            

            const data = await response.json();
            
            if(data.userId) {
                setLogin(true);
                window.location.assign('/');
            } else if (data.errors) {                        
                setBackEndErrorMsg(data.errors);
            }
        }
        
    };


    return (        
        <Container maxWidth="xs" sx={ {p: 2.0, margin: "20px auto" } }>
            <Typography variant="h4">Login Page</Typography>
            <Typography variant="h6" sx={{ mb: 2}}>Please enter the following to log in</Typography>
            <form noValidate autoComplete="off">  
                            
                <FormTextField id="email-input" name="email" label="Enter email" variant="outlined" type="email" required onChange={handleInputChange} helperText={ errors?.email !== "" ? errors.email : ""} error={errors?.emailError} />
                <FormTextField id="password-input" name="password" label="Set password" type="password" autoComplete="current-password" helperText={ errors?.password !== "" ? errors.password : "Password must be 8 characters long"}  required minLength="8" onChange={handleInputChange} error={errors?.passwordError} />                
                { (backEndErrorMsg.password !== '' || backEndErrorMsg.email !== '') && <Typography variant="p" sx={{ color: 'error.main' }}>{backEndErrorMsg.password}{backEndErrorMsg.email}</Typography>}
                <Box sx={{ display:"flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="p" color="primary" sx={{fontWeight: "bold"}}><Link href="/signup" underline="none">Create Account</Link></Typography>
                    <Button variant="contained" endIcon={<SendIcon />} type="submit" onClick={handleSubmit}>Submit</Button>
                </Box>
            </form>
        </Container>        
    )
}
