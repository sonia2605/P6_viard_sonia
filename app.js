const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// connexion à ma base de données
mongoose
  .connect(process.env.KEYDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


    
    //res.removeHeader("Cross-Origin-Resource-Policy");
    //res.removeHeader("Cross-Origin-Embedder-Policy");
    
const app = express();
const cors = require('cors');
app.use(cors());

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader('Cross-Origin-Resource-Policy','same-origin');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.removeHeader("Cross-Origin-Resource-Policy");
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes)
 
module.exports = app;
