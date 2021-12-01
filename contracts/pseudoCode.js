const Web3 = require('web3');
const web3 = new Web3();

//Dependencies needed to make a wallet
const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

/* Generate a mnemonic and seed: 
HD Wallets are created by a random bit of data called a seed. 
We will create a mnemonic and convert that mnemonic to a seed.         
*/        
const mnemonic = bip39.generateMnemonic(); //generates string        
const seed = bip39.mnemonicToSeedSync(mnemonic); //creates seed buffer

/* Generate the root of the node tree:
In most of cryptography, operations are performed at byte level. 
It is converted to hex here to easily verify expected behaviour 
in human readable format.
*/
const root = hdkey.fromMasterSeed('0x' + Buffer.from(seed, 'hex'));   
console.log(root.publicKey.toString('hex'));

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
const addrNode = root.derive("m/44'/60'/0'/0/0");       

/* 
From the derived public key, we compute the checksum to verify 
that it is indeed an ethereum address.        
*/

// const address = ethUtil.toChecksumAddress(addr);
// const encryptedJson = web3.eth.accounts.encrypt(masterPrivateKey, req.body.password); 