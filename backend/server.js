require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { Server } = require('socket.io');

const connectDb = require('./config/connectDb');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Math.random() * 100000 + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

connectDb()
  .then(() => console.log('Connected to DB successfully.'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Error handing middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, statusCode: status, data: data });
});

mongoose.connection.once('open', () => {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  io.on('connection', (socket) => {
    console.log('New client connected');
  });
});
