const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cookie = require('cookie-parser')
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
const uri = 'mongodb+srv://rebbavikas2000:vikas12345@cluster0.ljizzoj.mongodb.net/chatapp?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error:', err);
});
db.once('open', () => {
  app.listen(PORT,()=>console.log("server is running"))
  console.log('Connected to MongoDB Atlas');
});
const PORT = process.env.PORT || 9050;


app.use(express.json())
app.use(cookie())
app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/users",userRoutes);
app.get("/", (req, res) => {
    res.send("hello world");
});

