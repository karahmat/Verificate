const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ethereumNetSchema = new Schema(
    {        
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }, 
        nameOfNet: {
            type: String
        }, 
        address: {
            type: String
        }
    }, 
    {
        timestamps: true
    }
);

const EthereumNet = mongoose.model('ethereumNet', ethereumNetSchema);

module.exports = EthereumNet;