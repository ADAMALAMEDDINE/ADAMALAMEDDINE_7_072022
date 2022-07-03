//***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const DB = require('../db.config')
const User = DB.User

/**********************************/
/*** Routage de la ressource Auth */

exports.login = async (req, res) => {
    const { email, password } = req.body

    // Validation des données reçues
    if(!email || !password){
        return res.status(400).json({ message: 'Bad email or password'})
    }

    try{
        // Vérification si l'utilisateur existe
        let user = await User.findOne({ where: {email: email}, raw: true})
        if(user === null){
            return res.status(401).json({ message: 'This account does not exists !'})
        }

        // Vérification du mot de passe
        //let test = await bcrypt.compare(password, user.password)  
        let test = await User.checkPassword(password, user.password)
        if(!test){
            return res.status(403).json({ message: 'Wrong password'})
        }
        // Génération du token et envoi
        const token = jwt.sign({
            id: user.id,
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})
        
        return res.json({token, user_id: user.id, user_role: user.role})
    }catch(err){
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Database Error', error: err })
        }
        res.status(500).json({ message: 'Login process failed', error: err})        
    }
}

exports.signup = async (req, res) => {
    const { firstname, lastname, nickname, email, password } = req.body;
    // Validation des données reçues
    if(!firstname || !lastname || !nickname || !email || !password){
        return res.status(400).json({ message: 'Missing user informations'})
    }

    let role = "user";
    if(firstname === process.env.USER_ADMIN_FIRSTNAME) (
        role = "admin"
    )

    try{
        //création du User

       const user = await User.create({...req.body, role})
        return res.json({ message: 'User Created', data: user })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}