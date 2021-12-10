const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi} = require('./compile.js');

const newCertificate = async(testnetArg, addressArg, privateKeyArg, contractAdd, certificateArg) => {   
    const {studentId, documentHash, studentName, issuerID} = certificateArg;
        
    const provider = new HDWalletProvider(
        privateKeyArg,
        testnetArg,
    );

    const web3 = new Web3(provider);    
    let contract = new web3.eth.Contract(abi, contractAdd);
    
    const transactionReceipt = await contract.methods.setCertificate(studentId, documentHash, studentName, issuerID).send({gas: '2000000', from: addressArg});   
    
    return transactionReceipt;    
}

const getAllCertificates = async(testnetArg, addressArg, privateKeyArg, contractAdd) => {   
            
    const provider = new HDWalletProvider(
        privateKeyArg,
        testnetArg,
    );

    const web3 = new Web3(provider);    
    let contract = new web3.eth.Contract(abi, contractAdd);
    
    const studentIDs = await contract.methods.getStudentIDs().call({from: addressArg}); 
    const certificates = [];
    for (const studentID of studentIDs) {
        const certificate = await contract.methods.getCertificateInfo(studentID).call({from: addressArg});
        certificates.push({studentID: studentID, hash: certificate["0"], name: certificate["1"]});
    }
        
    return certificates;
}


module.exports = {newCertificate, getAllCertificates};