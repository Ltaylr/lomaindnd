const GalleryImage = require('./GalleryImage');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalSchema = new Schema({
        name: {
            type: String,
            required: true  
        },
        imageUrl:{
            type: String,
            required: false
        },
        sections:[
            {
                type: String,
                required: false
            }
        ],
        journalId:{
            type: Schema.Types.ObjectId,
            ref: 'Journal',
            required: true
        },
        imageCollection:[{
            type: Schema.Types.ObjectId,
            ref:GalleryImage,
            required:false
        }]
})

module.exports = mongoose.model('Journal', locationSchema)