import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Azcredify
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer() {
  
  return (
    
      <Container maxWidth="xl">
        <Copyright />
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          A blockchain-based certificate issuance and verification app
        </Typography>
        
      </Container>
    
  );
}

export default Footer;