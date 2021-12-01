const path = require('path');
const fs = require('fs');
const solc = require('solc');

const AzcredifyPath = path.resolve(__dirname, 'contracts', 'Azcredify.sol');
const source = fs.readFileSync(AzcredifyPath, 'utf8');

const compiledResult = solc.compile(source, 1).contracts[':Azcredify'];