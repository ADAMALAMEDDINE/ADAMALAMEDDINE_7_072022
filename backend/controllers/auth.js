//***********************************/
/*** Import des module nécessaires */
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
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
        let test = await bcrypt.compare(password, user.password)
        if(!test){
            return res.status(403).json({ message: 'Wrong password'})
        }
        // Génération du token et envoi
        const token = jwt.sign({
            id: user.id,
            lastname: user.lastname,
            firstname: user.firstname,
            email: maskEmail(email),
            nickname: user.nickname,
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
    let { firstname, lastname, nickname, email, password } = req.body;
    // Validation des données reçues
    if(!firstname || !lastname || !nickname || !email || !password){
        return res.status(400).json({ message: 'Missing user informations'})
    }

    let role = "user";
    if(firstname === process.env.USER_ADMIN_FIRSTNAME) (
        role = "admin"
    )

    password = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));


    try{
        //création du User
console.log({firstname, lastname, nickname, email, password, role});
       const user = await User.create({ firstname, lastname, nickname, email, password, role })
        return res.json({ message: 'User Created', data: user })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

const maskEmail = emailStr => {
    const splitedEmail = emailStr.split("@");
    return obfuscate(splitedEmail[0]) + '@' + obfuscate(splitedEmail[1]);

};

const obfuscate = str => {
    let obfuscated = "";
    for(let i = 0, l =  str.length; i < l; i++) {
        if(i < str.length / 2) {
            obfuscated += "*";
        } else {
            obfuscated += str[i];
        }
    }
    return obfuscated;
};