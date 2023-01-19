const { Schema, model} = require('mongoose')



const ReviewSchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true,
    },
    owner:{
        type: String,
        required: true,
    },
    ownerId:{
        type: String,
        required: true,
    },
    calification:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: false
    },
    movieId: {
        type: String,
        required: true,
    }
})


module.exports = model('Review', ReviewSchema)