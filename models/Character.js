const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema(
    {

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
        isPlayerChar:{
            type: Boolean,
            required: false
        },
        characterSheetUrl:{
            type: String,
            required: false
        },
        campaignId:{
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
            required: false
        },
        locationId:{
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
            required: false
        }

    }
)

module.exports = mongoose.model('Character', campaignSchema);