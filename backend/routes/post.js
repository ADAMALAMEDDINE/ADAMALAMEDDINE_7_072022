/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const checkTokenMiddleware = require('../jsonwebtoken/check')
const postCtrl = require('../controllers/post')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use( (req, res, next) => {
    const event = new Date()
    console.log('Post Time:', event.toString())
    next()
})

/**************************************/
/*** Routage de la ressource Post */

router.get('', postCtrl.getAllPosts)

router.get('/:id', postCtrl.getPost)

router.put('/create', checkTokenMiddleware, postCtrl.addPost)

router.patch('/:id', checkTokenMiddleware, postCtrl.updatePost)

router.post('/untrash/:id', checkTokenMiddleware, postCtrl.untrashPost)
    
router.delete('/trash/:id', checkTokenMiddleware, postCtrl.trashPost)

router.delete('/:id', checkTokenMiddleware, postCtrl.deletePost)

module.exports = router