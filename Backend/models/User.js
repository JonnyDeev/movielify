const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    id:{
        type: String,
        required: true,
        unique: true
    },
    dob:{
        type: String,
        required: false
    }
})


module.exports = model('User', UserSchema);