import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App.js';
import Container from '@mui/material/Container';

export default function Profile() {
    const userData = useContext(UserContext);
    return (
        <Container maxWidth="sm" sx={ {p: 2.0, margin: "20px auto" } }>
            <h1>This is my profile page</h1>
            <p>Email: {userData.email}</p>
            <p>Wallet Address: {userData.walletAddress}</p>
        </Container>
    )
}
