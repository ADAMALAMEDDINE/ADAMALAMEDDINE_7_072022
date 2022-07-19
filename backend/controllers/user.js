const bcrypt = require('bcrypt')
const DB = require('../db.config');
const User = DB.User;

exports.getAllUsers = (req, res) => {
    User.findAll()
    .then(users => res.status(200).json({ data: users}))
    .catch(err => res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err}))
}

exports.getUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (userId) {
        return res.status(400).json({ message: "Information(s) manquante(s)" })
    }

    //recuperation de l'utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if ((user === null)) {
                return res.status(404).json({ message: "this user does not exist" })
            }

            //utilisateur trouvé
            return res.status(200).json({ data: user })
                .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }))
        })
}

exports.addUser = (req, res) => {
    const { nom, prenom, nickname, email, password } = req.body

    //validation des données reçues
    if (!nom || !prenom || !email || !nickname) {
        return res.status(400).json({ message: "missing data" })
    }

    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            //verification si l'utilisateur existe deja
            if (user !== null) {
                return res.status(400).json({ message: `L'utilisateur ${nom} existe déjà !` })
            }
            // hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash


                    //creation de l'utilisateur
                    User.create(req.body)
                        .then(user => res.status(200).json({ message: "User created", data: user }))
                        .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }))

                })
                .catch(err => res.status(500).json({ message: "erreur lors du hashage du mot de passe", error: err }))


        })

        .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }));
}

exports.updateUser = async (req, res) => {
    let userId = parseInt(req.params.id);
    const { actualPassword, newPassword, email, nickname } = req.body;

    //verification si le champ id est présent et cohérent
    if (!userId || !actualPassword) {
        return res.status(400).json({ message: "Information(s) manquante(s)" });
    }
    const user = await User.findOne({ where: { id: userId }, raw: true });
              
    if (!user) {
        return res.status(404).json({ message: `Utilisateur non trouvé !` });
    }

    let passwordsMatch = await User.checkPassword(actualPassword, user.password)
    if(!passwordsMatch){
        return res.status(403).json({ message: 'Mauvais mot de passe'});
    }
    
    // hashage du mot de passe utilisateur
    if(newPassword) {
        user.password = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUND));
        // user.password = newPassword;
    }   

    user.email = email;
    user.nickname = nickname;

    //mise à jour de l'utilisateur
    User.update(user, { where: { id: userId } })
        .then(() => res.status(200).json({ message: "Utilisateur modifié" }))
        .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }));    
}

exports.untrashUser = (req, res) => {
    let userId = parseInt(req.params.id)
    if(!userId) {
        return res.status(400).json({ message: "Information(s) manquante(s)"})
    }
    User.restore({ where: {id:userId}})
    .then(() => res.status(204).json({}))
    .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err}))
}

exports.trashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: "Information(s) manquante(s)" })
    }

    //suppression de l'utilisateur
    User.destroy({ where: { id: userId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }))
}

exports.deleteUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: "Information(s) manquante(s)" })
    }

    //suppression de l'utilisateur
    User.destroy({ where: { id: userId }, force: true })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: "Une erreur inconnue est survenue", error: err }))
}