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
    contract = await contract.deploy({data: bytecode}).send({gas: '750000', gasPrice: '10000000000', from: addressArg});   
    const gasEstimate = await contract.deploy({data: bytecode}).estimateGas();
    console.log('contract is deployed to: ', contract.options.address);
    console.log('gas needed for deployment: ', gasEstimate);
    return contract.options.address;    
}

module.exports = deployContract;