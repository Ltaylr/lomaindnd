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
        }
    }
)

module.exports = mongoose.model('Campaign', campaignSchema);