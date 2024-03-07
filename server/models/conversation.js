const User = require('./user')
const Message = require('./message')
const mongoose = require('mongoose')
const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:[]
        },
    ],
},{timestamps:true})
const Conversation = mongoose.model("Conversation",conversationSchema)
module.exports = Conversation;