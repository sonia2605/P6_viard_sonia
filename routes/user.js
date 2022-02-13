const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkPassword = require("../middleware/check-password")
const checkEmail = require("../middleware/check-email")


// création des différentes routes de l'api en leur précisant dans l'ordre les middlewares
router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;