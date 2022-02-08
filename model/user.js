const moongose = require('mongoose');
const User = new moongose.Schema({


    googleId:{
        type: String,
        require:true
    },
    displayName:{
        type: String,
        require:true
    },
    firstName:{
        type: String,
        require:true
    },
    lastName:{
        type: String,
        require:true
    },
    image:{
        type: String
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
})
module.exports = moongose.model('user',User)
