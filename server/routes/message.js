const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const router = express.Router();

// Import the User model
const User = require('../models/user');
const { getReceiverSocketId, io } = require('../socket/socket');

// Middleware to protect the route
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Error" });
    }
};

// Apply protectRoute middleware to all routes in this router
router.use(protectRoute);

// Define the send route
router.post("/send/:id",protectRoute, async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()])
        const receiverSocketId  = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sending routes:", error.message);
        res.status(500).json({ error: "Internal error" });
    }
});
router.get("/:id",protectRoute,async (req,res)=>{
    try{
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]},
        }).populate("message");
        if(!conversation) return res.status(200).json([])
        const messages = conversation.message;
        res.status(200).json(messages)
    }catch (error) {
        console.error("Error in getting messages:", error.message);
        res.status(500).json({ error: "Internal Error" });
    }

})

module.exports = router;
