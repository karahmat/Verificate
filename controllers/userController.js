require('dotenv').config();
const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware');

//Dependencies needed to make a wallet
const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');


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
const createToken = (id, walletAddress) => {
    return jwt.sign({ id, walletAddress }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

//create a user
router.post('/signup', async (req,res) => {
    
    try {                     
        // const wallet = web3.eth.accounts.create();
        // const encryptedJson = web3.eth.accounts.encrypt(wallet.privateKey, req.body.password);     
        
        /* Generate a mnemonic and seed: 
        HD Wallets are created by a random bit of data called a seed. 
        We will create a mnemonic and convert that mnemonic to a seed.         
        */        
        const mnemonic = bip39.generateMnemonic(); //generates string        
        const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer

        /* Generate the root of the node tree and get the Private and Public Key:
        In most of cryptography, operations are performed at byte level. 
        It is converted to hex here to easily verify expected behaviour 
        in human readable format.
        */
        const root = hdkey.fromMasterSeed('0x' + Buffer.from(seed, 'hex'));        
        const masterPrivateKey = root.privateKey.toString('hex');        
        
        /*Create the address: 
        In Ethereum, each address is considered an account. 
        An HD wallet is a public/private key tree all starting from a master node. 
        The tree is represented by a derivation path. 
        The default derivation path for Ethereum is m/44'/60'/0'/0. 
        Each number in that path represents a certain level in the tree above.
        -- 44 — BIP 44 Purpose
        -- 60 — Ethereum’s coin type
        -- 0 — Account 0
        -- 0 — Chain 0
        */
        // const addrNode = root.derive("m/44'/60'/0'/0/0");         
        // const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        // const addr = '0x' + ethUtil.publicToAddress(pubKey).toString('hex');
        
        /* 
        From the derived public key, we compute the checksum to verify 
        that it is indeed an ethereum address.        
        */
        // const address = ethUtil.toChecksumAddress(addr);
        const address = web3.eth.accounts.privateKeyToAccount(masterPrivateKey).address;
        const encryptedJson = web3.eth.accounts.encrypt(masterPrivateKey, req.body.password); 

        const user = await User.create({
            email: req.body.email,
            password: req.body.password, 
            encryptedJson: encryptedJson
        });
        
        const token = createToken(user._id, address);
        //send cookie to browser, but it cannot be accessed by clicking document.cookie due to httpOnly: true
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(201).json({ data: 'Success', dataMnemonic: mnemonic });   
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
        
        res.status(201).json({
            userId: user._id,            
            email: user.email,
            walletAddress: req.profile.walletAddress             
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
        const wallet = web3.eth.accounts.decrypt(user.encryptedJson, password);        
        const token = createToken(user._id, wallet.address);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(200).json( { userId: user._id, email: user.email, walletAddress: wallet.address } )
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
    res.status(200).json({data: 'signed out'})
});

module.exports = router;

