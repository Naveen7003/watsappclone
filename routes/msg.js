const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    msg: {
        type: String,
        required: [ true, 'msg is required for creating an message document' ]
    },
    sender: {
        type: String,
        
    },
    receiver: {
        type: String,
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('msg', msgSchema)