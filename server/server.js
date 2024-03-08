const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookie = require('cookie-parser');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
const { app, server } = require('./socket/socket');

dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error:', err);
});
db.once('open', () => {
  server.listen(PORT, () => console.log("server is running"));
  console.log('Connected to MongoDB Atlas');
});

const PORT = process.env.PORT || 9050;

app.use(express.json());
app.use(cookie());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
