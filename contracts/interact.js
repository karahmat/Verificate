const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi} = require('./compile.js');

const newCertificate = async(testnetArg, addressArg, privateKeyArg, contractAdd, certificateArg) => {   
    const {studentId, documentHash, studentName, issuerName} = certificateArg;
        
    const provider = new HDWalletProvider(
        privateKeyArg,
        testnetArg,
    );

    const web3 = new Web3(provider);    
    let contract = new web3.eth.Contract(abi, contractAdd);
    
    const transactionReceipt = await contract.methods.setCertificate(studentId, documentHash, studentName, issuerName).send({gas: '2000000', from: addressArg});   
    
    return transactionReceipt;    
}


module.exports = newCertificate;