const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema(
    {
        
        imageUrl:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false  
        },
        campaign: {
            type:Schema.Types.ObjectId, ref: 'Campaign'
        }

    }
)

module.exports = mongoose.model('Image', imageSchema);