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
        return res.status(400).json({ message: 'Veuillez saisir un mail et un mot de passe valide'})
    }

    try{
        // Vérification si l'utilisateur existe
        let user = await User.findOne({ where: {email: email}, raw: true})
        if(user === null){
            return res.status(401).json({ message: 'Compte utilisateur non trouvé !'})
        }

        // Vérification du mot de passe
        //let test = await bcrypt.compare(password, user.password)  
        let test = await bcrypt.compare(password, user.password)
        if(!test){
            return res.status(403).json({ message: 'Mot de passe non valide'})
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
        
        return res.status(200).json({token, user_id: user.id, user_role: user.role})
    }catch(err){
        console.log(err);
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err })
        }
        res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err})        
    }
}

exports.signup = async (req, res) => {
    let { firstname, lastname, nickname, email, password } = req.body;
    // Validation des données reçues
    if(!firstname || !lastname || !nickname || !email || !password){
        return res.status(400).json({ message: "Veuillez saisir l'ensemble des onglets"})
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
        return res.json({ message: 'Votre profil a bien été crée', data: user })
    }catch(err){
        return res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err })
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