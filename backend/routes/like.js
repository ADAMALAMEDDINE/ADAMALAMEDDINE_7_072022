/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const likeCtrl = require('../controllers/like')
const authCheck = require('../middleware/auth');


/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/**************************************/
/*** Routage de la ressource Post */

router.get('/add-remove/:user_id/:post_id', authCheck, likeCtrl.addRemove)

module.exports = router