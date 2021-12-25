import React, {useContext} from 'react';
import {UserContext} from '../App';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DoneIcon from '@mui/icons-material/Done';

function Homepage() {
  const userData = useContext(UserContext);
  const mainFeaturedPost = {
      title: 'Access the Power of Blockchain Now',
      description:
        "Store and issue verifiable certificates into the Ethereum blockchain.",
      image: '/images/blockchainBkground.jpeg',
      imageText: 'main image description',
      linkText: 'Get Started',
    };

  const whyVerificate = [
      "Simple to Use - No further installation required", 
      "No Need to Create Your Own Crypto Wallet", 
      "Easy Verification Process", 
      "Works on any Computer"
  ]

  return (
    <>
    <Paper
      sx={{
        backgroundColor: 'grey.800',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        color: '#fff',
        mb: 1,
        borderRadius: 0,
        minHeight: {xs: "100vh", sm: "100%"},
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${mainFeaturedPost.image})`,
     }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={mainFeaturedPost.image} alt={mainFeaturedPost.imageText} />}
      
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
            p: { xs: 3, md: 6 },
            pr: { md: 0 },
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" sx={{fontWeight: "bold"}} mb={3}>
              {mainFeaturedPost.title}
            </Typography>
            <Slide appear={true} in={true} direction="right" timeout={200}>
                <Typography variant="h5" color="inherit" mt={3} paragraph>
                {mainFeaturedPost.description}
                </Typography>
            </Slide>
            <Slide appear={true} in={true} direction="right" timeout={600}>
                <Typography variant="h5" color="inherit" mb={6} paragraph>
                Prevent Fraud. Allow Easy Verification
                </Typography>
            </Slide>
            { userData?.userId === "" ? 
            <Button variant="contained" size="large" href="/explore" sx={{maxWidth: "33%", minWidth: "200px"}}>        
              {mainFeaturedPost.linkText}
            </Button> :
            <Button variant="contained" size="large" href="/submitDoc"sx={{maxWidth: "33%", minWidth: "200px"}}>Submit Doc</Button> 
             }
          </Box>
        </Grid>
     </Grid>
    </Paper>
    <Box sx={{
        backgroundColor: "#f1f8fc",
        p: { xs: 3, md: 6 },
        pr: { md: 0 },
        }}
    >
        <Typography variant="h4" mb={2} color="darkblue" sx={{fontWeight: "bold"}}>Why Verificate?</Typography>
        <List>
            { whyVerificate.map((reason) => (
            <ListItem>
                <ListItemIcon>
                    <DoneIcon />
                </ListItemIcon>
                <ListItemText >
                    <Typography sx={{fontSize: "1.3rem"}}>{reason}</Typography>
                </ListItemText>
            </ListItem>  
            ))}  
        </List>
    </Box>
    </>
  );
}


export default Homepage;