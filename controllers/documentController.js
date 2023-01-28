require('dotenv').config();
const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3();
const User = require('../models/user');
const EthereumNet = require('../models/ethereumNet');
const { requireAuth } = require('../middleware/authMiddleware');

//Dependency to send email
const sendEmail = require('../utils/sendEmail');

//Dependencies needed to deploy and interact with the smart contract
const deployContract = require('../contracts/pseudoDeploy');
const {newCertificate, getAllCertificates, getWalletBalance} = require('../contracts/interact');
const getTransactionData = require('../contracts/getTransactionData');

//======================
//Dependencies and Configurations for file storage and multer

const multer = require('multer');
const fs = require('fs');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
})

const uploadMiddleware = multer({
  storage: diskStorage,
}).any();
//=============================================

//Dependencies and configuration for the Interplentary File System (IPFS)
const {create} = require('ipfs-http-client');

//Middleware
router.use(uploadMiddleware);

//HTTP routes for different testnets and mainnet
const testnetObj = {
    'localhost': 'http://localhost:8545',
    'rinkeby' : `https://goerli.infura.io/v3/${process.env.RINKEBY_API}`, 
    'mainnet' : `https://goerli.infura.io/v3/${process.env.MAINNET_API}`,
};

router.post('/certificates', requireAuth, async(req, res) => {
    try {
        const user = await User.findOne({_id: req.profile.id});
        const deployedContract = await EthereumNet.findOne({userId: req.profile.id, nameOfNet: req.body.testnet});         
        const {address} = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);   
        const result = await getAllCertificates(testnetObj[req.body.testnet], address, req.body.privateKey, deployedContract.address);    
        console.log(result);
        res.status(200).json({data: "Success", result: result});
    } catch (err) {
        console.log(err);
        res.status(404).json({dataError: "Error at backend"});
    }
    

});


router.post('/deploy', requireAuth, async(req,res) => {
    
    if (req.profile.id === req.body.userId) {
        try {
            const user = await User.findOne({_id: req.body.userId});
            const {address} = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);     
            const etherBalance = await getWalletBalance(testnetObj[req.body.testnet], address, req.body.privateKey);
            
            if (parseFloat(etherBalance) >= 0.0075) {
                const contractAddress = await deployContract(testnetObj[req.body.testnet], address, req.body.privateKey);
            
                const ethNet = await EthereumNet.create({
                    userId: req.body.userId,
                    nameOfNet: req.body.testnet,
                    address: contractAddress
                });
                
                res.status(200).json({data: "Success"});
            } else {
                console.log("Not enough Ether", etherBalance);
                res.status(404).json({dataError: `You do not have at least 0.0075 Ether to deploy Contract. You only have ${etherBalance} Ether. Please get more Ether`});
            }
            
        } catch (err) {
            const errMsg = err.message.split("{")[0];
            res.status(404).json({dataError: errMsg});
        }
          
    }
});

router.post('/new', requireAuth, async(req, res) => {

    try {
        //const user = await User.findOne({_id: req.profile.id});
        const deployedContract = await EthereumNet.findOne({userId: req.profile.id, nameOfNet: req.body.testnet});
        
        const ipfsObj = {
            'localhost': {host: 'localhost', port: '5001', protocol: 'http'},
            'infura': {host: 'ipfs.infura.io', port: '5001', protocol: 'https', path: 'api/v0'}
        };
    
        if (req.files[0]) {
            let ipfs = await create(ipfsObj['infura']);        

            const file = req.files[0];
            const fileBuffer = fs.readFileSync(file.path);
            const fileAdded = await ipfs.add({path: file.filename, content: fileBuffer});        
            const fileHash = fileAdded.cid.toString();        
            
            //const {studentId, documentHash, studentName, issuerName} = certificateArg;

            const certificateParams = {
                studentId: req.body.studentId, 
                documentHash: fileHash, 
                studentName: req.body.studentName, 
                issuerID: req.profile.id
            };

            const {address} = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);
            const etherBalance = await getWalletBalance(testnetObj[req.body.testnet], address, req.body.privateKey);
            
            if (parseFloat(etherBalance) >= 0.002) {
                const transactionReceipt = await newCertificate(testnetObj[req.body.testnet], address, req.body.privateKey, deployedContract.address, certificateParams);
                const rootPath = `${req.protocol}://${req.hostname}:${process.env.REACT_PORT}/documents/${req.body.testnet}`; 
                await sendEmail(req.body.studentEmail, req.body.studentName, transactionReceipt.transactionHash, file, rootPath);

                fs.unlinkSync(`./uploads/${file.filename}`);            
                
                res.status(200).json({data: "Success"});
            } else {
                res.status(404).json({dataError: `You do not have at least 0.002 Ether. You only have ${etherBalance} Ether. Please get more Ether`});
            }
        }  
    } catch(err) {
        const errMsg = err.message.split("{")[0];
        res.status(404).json({dataError: errMsg});
    }
});

router.post('/verifyIpfs', async (req,res) => {

    const ipfsObj = {
        'localhost': {host: 'localhost', port: '5001', protocol: 'http'},
        'infura': {host: 'ipfs.infura.io', port: '5001', protocol: 'https', path: 'api/v0'}
    };

    try {
        if (req.files[0]) {
            let ipfs = await create(ipfsObj['infura']);        
    
            const file = req.files[0];
            const fileBuffer = fs.readFileSync(file.path);
            const fileAdded = await ipfs.add({path: file.filename, content: fileBuffer});        
            const fileHash = fileAdded.cid.toString(); 
            fs.unlinkSync(`./uploads/${file.filename}`);                 
            res.status(200).json({ipfsHash: fileHash});
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({dataError: "Error at backend"});
    }
   

});


router.get('/verify/:testnet/:txnHash', async (req, res) => {            
    
    try {
        const testnetObj = {
            'localhost': 'http://localhost:8545',
            'rinkeby' : `https://goerli.infura.io/v3/${process.env.RINKEBY_API}`,
            'mainnet' : `https://goerli.infura.io/v3/${process.env.MAINNET_API}`,
        };

        const transactionData = await getTransactionData(req.params.txnHash, testnetObj[req.params.testnet]);        
        const user = await User.findOne({_id: transactionData["3"]});

        res.status(200).json({
            documentHash: transactionData["1"],
            studentName: transactionData["2"],
            studentId: transactionData["0"],
            issuerName: user.issuer, 
            domainValidated: user.domainValidated
        });
    } catch (err) {
        console.log(err);
    }
});

//const getWalletBalance = async(testnetArg, addressArg, privateKeyArg) => {   
// router.get('/walletBalance', async(req,res) => {
//     try {
//         const {address} = web3.eth.accounts.privateKeyToAccount("48d29642ec637702fe6e5017dacc71cc75f4b9df5df8f5114901f89fc46a862f");                    
//         const etherBalance = await getWalletBalance(testnetObj["localhost"], address, "48d29642ec637702fe6e5017dacc71cc75f4b9df5df8f5114901f89fc46a862f");
//         res.status(200).json({data: etherBalance});
//     } catch (err) {
//         console.log(err);
//     }
    

// });

module.exports = router;