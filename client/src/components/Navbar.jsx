import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App.js';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { logOut } from '../utils/logOut';

const pages = ['Submit Doc', 'Settings'];
const links = ["/submitDoc", "/settingPage"]
const settings = ['Profile', 'Dashboard'];
const settingsLinks = ["/profile", "/dashboard"];

export default function Navbar() {    
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const userData = useContext(UserContext);
    const [loggedIn, setLoggedIn] = useState(false)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logOut().then((res) => {
          if (res === 'signed out') {
            setLoggedIn(false)
            window.location.assign('/')
          }
        })
    }

    useEffect(() => {
        if (userData.userId !== '') {
          setLoggedIn(true)
        }
      }, [userData]);

    return (        
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
                >
                    AzCredify
                </Typography>
                { loggedIn && 
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                    {pages.map((page, index) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                            <Link href={links[index]} sx={{ color: 'text.primary' }} underline="none"><Typography textAlign="center">{page}</Typography></Link>
                        </MenuItem>
                    ))}
                    </Menu>
                    
                </Box>
                }
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}
                >
                    AzCredify
                </Typography>
                
                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                    { loggedIn && 
                    <>
                    {pages.map((page, index) => (
                    <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <Link href={links[index]} sx={{ color: 'white' }} underline="none">{page}</Link>
                    </Button>
                    ))}
                    </>
                    }
                </Box>
                
                {loggedIn === false && (
                <>
                <Link href="/signup" sx={{ color: 'white' }} underline="none"><MenuItem color="inherit">Register</MenuItem></Link>                
                <Link href="/login" sx={{ color: 'white' }} underline="none"><MenuItem color="inherit">Login</MenuItem></Link>                
                </>
                )}
                {loggedIn && (
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar>{ userData?.email?.slice(0,2).toUpperCase() }</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting, index) => (
                        <MenuItem key={setting} onClick={handleCloseNavMenu}>
                            <Link href={settingsLinks[index]} sx={{ color: 'black' }} underline="none"><Typography textAlign="center">{setting}</Typography></Link>
                        </MenuItem>
                    ))}
                        <MenuItem key="logout" onClick={handleLogout}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
                )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
