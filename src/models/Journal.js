const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalSchema = new Schema({
        name: {
            type: String,
            required: true  
        },
        imageUrl:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        campaignId:{
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
            required: true
        }
})

module.exports = mongoose.model('Journal', locationSchema)