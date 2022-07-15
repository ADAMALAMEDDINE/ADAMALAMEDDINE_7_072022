/***********************************/
/*** Import des module nécessaires */
const express = require('express');
const authCheck = require('../middleware/auth');
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');

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

router.get('', authCheck, postCtrl.getAllPosts)

router.get('/get-one/:id', authCheck, postCtrl.getOne)

router.get('/get-content/:id', authCheck, postCtrl.getContent)

router.put('/create', authCheck, multer, postCtrl.addPost)

router.post('/:id', authCheck, multer, postCtrl.updatePost)

router.post('/:id/admin', (req, res, next) => {authCheck(req, res, next, true)}, multer, postCtrl.updatePost)

// router.post('/untrash/:id', authCheck, postCtrl.untrashPost)
    
// router.delete('/trash/:id', authCheck, postCtrl.trashPost)

router.delete('/:id', authCheck, postCtrl.deletePost)

router.delete('/:id/admin', (req, res, next) => {authCheck(req, res, next, true)}, postCtrl.deletePost)

module.exports = router