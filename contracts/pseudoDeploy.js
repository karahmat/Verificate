const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const Azcredify = require('./compile.js');

const address = "0x1C205Fd71B7925190BF972fF28D44546c4B881B4";


const deploy = async() => {
    const privateKey = "0x1a9166f68e8ea47362eb528e8bbaf777830b012578ceefdc0c577b6a33c8df9d";
    const provider = new HDWalletProvider(
        privateKey,
        'http://localhost:8545'
    );
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    //console.log('contract is deployed by: ', accounts[0]);
    console.log(JSON.parse(interface));
    // const result = await new web3.eth.Contract(JSON.parse(interface))
    // .deploy({data: "0x" + bytecode})
    // .send({gas: '2000000', from: accounts[0]})

    // console.log('Contract deployed to address', result.options.address);
}

deploy();