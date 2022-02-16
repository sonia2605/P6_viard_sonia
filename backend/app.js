const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// connexion à ma base de données
mongoose
  .connect(process.env.key_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log("Connexion à MongoDB échouée !"));

//Lancement de Express
const app = express();

// Cors - Headers des requêtes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // accéder à API depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.removeHeader("Cross-Origin-Resource-Policy")
  res.removeHeader("Cross-Origin-Embedder-Policy")
  next();
});

// il intercepte toutes les requetes qui ont un content-type json = corps de la requete
app.use(express.json());
var cors = require('cors');
app.use(cors());
// routes
app.use(helmet());
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
