//IMPORT DES MODULES necessaires

const express = require("express")
const userCtrl = require('../controllers/user')
const authCheck = require('../middleware/auth');

//recuperation du routeur d'express

let router = express.Router()

//Middleware pour logger dates de requete
router.use( (req, res, next) => {
    const event = new Date()
    console.log('User Time', event.toString())
    next()
})

//routage de la ressource User

router.get('/', (req, res, next) => {
    authCheck(req, res, next, true);
}, userCtrl.getAllUsers)

// router.get("/:id", authCheck, userCtrl.getUser)

router.patch("/:id", authCheck, userCtrl.updateUser) 

router.delete("/:id", authCheck, userCtrl.deleteUser)

module.exports = router