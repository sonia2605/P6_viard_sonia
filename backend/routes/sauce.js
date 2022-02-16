// création d'un routeur
const express = require('express');
const router = express.Router();

// On enregistre toutes les routes sur le router
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const checkSauceInput = require('../middleware/check-sauce-input');
const sauceCtrl = require('../controllers/sauce');

// création des différentes routes de l'api en leur précisant les middlewares dans l'ordre
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.put("/:id", auth, multer, checkSauceInput, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;