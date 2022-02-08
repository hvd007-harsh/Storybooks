const mongoose = require('mongoose');
const Story = new mongoose.Schema({


    title:{
        type: String,
        required:true,
        trim: true
    },
    body:{
        type: String,
        required:true
    },
    status:{
        type: String,
        default: 'private',
        enum:['public','private']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Story',Story)
