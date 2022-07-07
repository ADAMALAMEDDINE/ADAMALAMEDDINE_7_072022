/***********************************/
/*** Import des module nécessaires */
const express = require('express');
const checkTokenMiddleware = require('../jsonwebtoken/check');
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
// let multer = require('multer');
// let upload = multer();
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

router.get('/get-one/:id', postCtrl.getOne)

router.get('/get-content/:id', postCtrl.getContent)

router.put('/create', checkTokenMiddleware, multer, postCtrl.addPost)

router.post('/:id', checkTokenMiddleware, multer, postCtrl.updatePost)

router.post('/untrash/:id', checkTokenMiddleware, postCtrl.untrashPost)
    
router.delete('/trash/:id', checkTokenMiddleware, postCtrl.trashPost)

router.delete('/:id', checkTokenMiddleware, postCtrl.deletePost)

module.exports = router