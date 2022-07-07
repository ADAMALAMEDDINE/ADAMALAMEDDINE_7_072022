/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const dislikeCtrl = require('../controllers/dislike')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/**************************************/
/*** Routage de la ressource Post */

router.get('/add-remove/:user_id/:post_id', dislikeCtrl.addRemove)

module.exports = router