const { Schema, model} = require('mongoose')

const CommentSchema = new Schema({
    owner:{
        type: String,
        required: true,
    },
    id:{
        type: String,
        required: true,
        unique: true
    },
    content:{
        type: String,
        required: true,
    },
    replies:[{}],
    repliesCount:{
        type: Number,
        defaul:0
    },
    likes:[{}],
    likesCount:{
        type: Number,
        default:0
    }

},
{timestamps:true}
)


module.exports = model('Comment', CommentSchema)