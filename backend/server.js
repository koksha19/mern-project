const express = require('express');

const feedRoutes = require('./routes/feedRoutes');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
