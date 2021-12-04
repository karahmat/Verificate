require('dotenv').config({ path: `${__dirname}/../.env` });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const getTransactionData = async (transactionHash, testnetArg) => {
    
    const provider = new HDWalletProvider(
        process.env.SUPER_PRIVATEKEY,
        testnetArg
    );
    
    const web3 = new Web3(provider);     
    const result = await web3.eth.getTransaction(transactionHash);    
    const tx_data = result.input;
    const input_data = '0x' + tx_data.slice(10); // get only data without function selector

    const params = await web3.eth.abi.decodeParameters(['string', 'string', 'string', 'string'], input_data);
    return params;
    
}

module.exports = getTransactionData;

