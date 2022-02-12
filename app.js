const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// connexion à ma base de données
mongoose.connect('mongodb+srv://sonia:BrienneLeChat@cluster0.3j7hp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('requête MongoDB échouée !'));


// Cors - Headers des requêtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');// accéder à API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // envoyer des requetes avec get, post,  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// il intercepte toutes les requetes qui ont un content-type json = corps de la requete
app.use(express.json());

// ajout de morgan pour le log des requetes HTTP
app.use(morgan('combined'));

// routes
app.use(helmet());
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);

module.exports =app;