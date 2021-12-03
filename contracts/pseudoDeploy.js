const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, bytecode} = require('./compile.js');

const deployContract = async(testnetArg, addressArg, privateKeyArg) => {    
    const provider = new HDWalletProvider(
        privateKeyArg,
        testnetArg,
    );
    const web3 = new Web3(provider);    
    let contract = new web3.eth.Contract(abi);
    contract = await contract.deploy({data: bytecode}).send({gas: '2000000', from: addressArg});   
    
    console.log('contract is deployed to: ', contract.options.address);
    return contract.options.address;    
}

module.exports = deployContract;