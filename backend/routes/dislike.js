/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const dislikeCtrl = require('../controllers/dislike')
const authCheck = require('../middleware/auth');


/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/**************************************/
/*** Routage de la ressource Post */

router.get('/add-remove/:user_id/:post_id', authCheck, dislikeCtrl.addRemove)

module.exports = router