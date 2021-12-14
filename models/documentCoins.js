const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentCoinsSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        coins: {
            type: Number, 
            required: false
        }
    },     
    {
        timestamps: true
    });

const DocumentCoins = mongoose.model('documentCoins', documentCoinsSchema);

module.exports = DocumentCoins;