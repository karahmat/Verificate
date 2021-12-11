require('dotenv').config();
const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EthereumNet = require('../models/ethereumNet');
const { requireAuth } = require('../middleware/authMiddleware');

//Dependencies needed to make a wallet
const bip39 = require('bip39');
const {hdkey} = require('ethereumjs-wallet');


//function to handle errors
const handleErrors = (err) => {
    console.log("handleErrors function is called");  
    let errors = { email: '', password: '', token: '' };

    //incorrect username
    if (err.message === "incorrect email") {
        errors.email = "This email or password is wrong";
    }

    //incorrect password
    if (err.message === "incorrect password") {
        errors.password = "This email or password is wrong";
    }

    //duplicate error code 
    if (err.code === 11000) {
        errors.email = "That email is already registered";
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(item => {
            errors[item.properties.path] = item.properties.message;            
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60; //in seconds
const createToken = (id ) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

//create a user
router.post('/signup', async (req,res) => {
    
    try {                     
        
        /* Generate a mnemonic and seed: 
        HD Wallets are created by a random bit of data called a seed. 
        We will create a mnemonic and convert that mnemonic to a seed.         
        */        
        const mnemonic = bip39.generateMnemonic(); //generates string        
        const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer

        // Generate the root of the node tree and get the Private and Public Key:        
        const hdwallet = hdkey.fromMasterSeed(seed);        
                
        /*Create the address: 
        In Ethereum, each address is considered an account. 
        An HD wallet is a public/private key tree all starting from a master node. 
        The tree is represented by a derivation path. 
        The default derivation path for Ethereum is m/44'/60'/0'/0/{accountIndex}. 
        Each number in that path represents a certain level in the tree above.
        -- 44 — BIP 44 Purpose
        -- 60 — Ethereum’s coin type
        -- 0 — Account 0
        -- 0 — Chain 0
        */
        const privateKeys = [];
        const addresses = [];
        
        for (let i=0; i<5; i++) {
            const wallet_hdpath = `m/44'/60'/0'/0/${i}`;                 
            const wallet = hdwallet.derivePath(wallet_hdpath).getWallet();        
            privateKeys.push(wallet.privateKey.toString('hex'));        
            addresses.push(wallet.getAddressString());
        }
        
        const user = await User.create({
            email: req.body.email,
            password: req.body.password, 
            domain: req.body.domain, 
            domainValidated: false, 
            issuer: req.body.issuer, 
            walletAddress: addresses[0]            
        });
        
        const token = createToken(user._id);
        //send cookie to browser, but it cannot be accessed by clicking document.cookie due to httpOnly: true
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.cookie('isLoggedIn', true, {maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(201).json({ data: 'Success', dataMnemonic: mnemonic, privateKeys, addresses });   
    }
    catch (err) {   
        console.log(err);                         
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }

});

//fetch a user through jwt
router.get('/jwt', requireAuth, async (req,res) => {
    
    try {        
        const user = await User.findOne({_id: req.profile.id});
        const ethereumAdd = await EthereumNet.find({userId: req.profile.id});
        
        res.status(201).json({
            userId: user._id, 
            email: user.email, 
            domain: user.domain, 
            issuer: user.issuer, 
            domainValidated: user.domainValidated,
            walletAddress: user.walletAddress,
            contractAddress: ethereumAdd
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.login(email,password); //static method                
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); //maxAge in milliseconds here  
        res.cookie('isLoggedIn', true, {maxAge: maxAge * 1000})     
        res.status(200).json({ 
            userId: user._id, 
            email: user.email, 
            domain: user.domain, 
            issuer: user.issuer, 
            domainValidated: user.domainValidated,
            walletAddress: user.walletAddress,
            contractAddress: user.contractAddress 
            });        
    }
    catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json({ errors });
    }

});

//user signout
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1} );
    res.cookie('isLoggedIn', '', {maxAge: 1});
    res.status(200).json({data: 'signed out'})
});

module.exports = router;

