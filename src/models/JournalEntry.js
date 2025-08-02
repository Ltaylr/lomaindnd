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
        journalId:{
            type: Schema.Types.ObjectId,
            ref: 'Journal',
            required: true
        }
})

module.exports = mongoose.model('Journal', locationSchema)