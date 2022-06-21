/*const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');

const verifyPassword = require('../middleware/verifyPassword');

router.post('/signup', verifyPassword,  userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;*/

//IMPORT DES MODULES necessaires

const express = require("express")
const { beforeDestroy, hasHook } = require("../db.config")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const userCtrl = require('../controllers/user')
const checkTokenMiddleware = require('../jsonwebtoken/check')
//recuperation du routeur d'express

let router = express.Router()

//Middleware pour logger dates de requete
router.use( (req, res, next) => {
    const event = new Date()
    console.log('User Time', event.toString())
    next()
})

//routage de la ressource User
/*router.get("", (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).status.json({ message: "erreur", error: err }))
})*/

router.get('/', userCtrl.getAllUsers)

router.get("/:id", userCtrl.getUser)

router.put("", userCtrl.addUser)

router.patch("/:id", userCtrl.updateUser) 

router.post("/untrash/:id", userCtrl.untrashUser)

router.delete('/trash/:id', userCtrl.trashUser)

router.delete("/:id", userCtrl.deleteUser)

module.exports = router