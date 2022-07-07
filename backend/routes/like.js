/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const likeCtrl = require('../controllers/like')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/**************************************/
/*** Routage de la ressource Post */

router.get('/add-remove/:user_id/:post_id', likeCtrl.addRemove)

module.exports = router