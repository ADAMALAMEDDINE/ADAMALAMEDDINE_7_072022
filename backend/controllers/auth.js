//***********************************/
/*** Import des module nécessaires */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const DB = require('../db.config');
const User = DB.User;

/**********************************/
/*** Routage de la ressource Auth */

exports.login = async (req, res) => {
    const { email, password } = req.body

    // Validation des données reçues
    if(!email || !password){
        return res.status(400).json({ message: 'Adresse mail ou mot de passe manquant(s)'})
    }

    try{
        // Vérification si l'utilisateur existe
        let user = await User.findOne({ where: {email: email}, raw: true})
        if(user === null){
            return res.status(401).json({ message: 'Ce compte n\'existe pas !'})
        }

        // Vérification du mot de passe
        //let test = await bcrypt.compare(password, user.password)  
        let test = await User.checkPassword(password, user.password)
        if(!test){
            return res.status(403).json({ message: 'Mot de passe incorrect'})
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
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err })
        }
        res.status(500).json({ message: 'Echec lors de la connexion.', error: err})        
    }
}

exports.signup = async (req, res) => {
    let { firstname, lastname, nickname, email, password } = req.body;
    // Validation des données reçues
    if(!firstname || !lastname || !nickname || !email || !password) {
        return res.status(400).json({ message: 'Information(s) manquante(s)'})
    }

    if(!nickname.match(/([A-Za-z0-9]{3,}$)/)) {
        return res.status(400).json({ message: 'Le pseudonyme doit contenir au moins 3 caractères alphanumériques.'})
    }

    if(!firstname.match(/([A-Za-z]{2,}$)/)) {
        return res.status(400).json({ message: 'Format du prénom non-valide.'})
    }

    if(!lastname.match(/([A-Za-z]{2,}$)/)) {
        return res.status(400).json({ message: 'Format du nom non-valide.'})
    }

    if(!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.'})
    }


    let role = "user";
    if(firstname === process.env.USER_ADMIN_FIRSTNAME) (
    role = "admin"
    )

    password = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));


    try{
        //création du User
        const user = await User.create({ firstname, lastname, nickname, email, password, role })
        return res.status(200).json({ message: 'Utilisateur créé !', data: user })
    }catch(err){
        let message = 'Une erreur inconnue est survenue';
        if(err.original.code === "ER_DUP_ENTRY") {
            message = "Le pseudo " + nickname + " est déjà pris !";
        }
        return res.status(400).json({ message, error: err })
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