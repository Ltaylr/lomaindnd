const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema(
    {
        title: {
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
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        imageCollection:[{
            type: Schema.Types.ObjectId,
            ref: 'Image',
            required: false
        }],
        journal:{
            type: Schema.Types.ObjectId,
            ref: 'Journal',
            required: false
        }
        
    }
)

module.exports = mongoose.model('Campaign', campaignSchema);