const bcrypt = require('bcrypt')
const User = require('../models/user')
const router = require('../routes/user')

exports.getAllUsers = (req, res) => {
    User.findAll()
    .then(users => res.json({ data: users}))
    .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
}

exports.getUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (userId) {
        return res.json(400)({ message: "Missing parameter" })
    }

    //recuperation de l'utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if ((user === null)) {
                return res.status(404).json({ message: "this user does not exist" })
            }

            //utilisateur trouvé
            return res.json({ data: user })
                .catch(err => res.status(500).json({ message: "Database Error", error: err }))
        })
}

exports.addUser = (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body

    //validation des données reçues
    if (!nom || !prenom || !email || !pseudo) {
        return res.status(400).json({ message: "missing data" })
    }

    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            //verification si l'utilisateur existe deja
            if (user !== null) {
                return res.status(400).json({ message: `the user ${nom} already exists` })
            }
            // hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash


                    //creation de l'utilisateur
                    User.create(req.body)
                        .then(user => res.json({ message: "User created", data: user }))
                        .catch(err => res.status(500).json({ message: "Database Error", error: err }))

                })
                .catch(err => res.status(500).json({ message: "Hash process error", error: err }))


        })

        .catch(err => res.status(500).json({ message: "Database Error", error: err }))
}

exports.updateUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: "Missing paramater" })
    }

    //recherche de l'utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            //verification si 'utilisateur existe
            if (user === null) {
                return res.status(400).json({ message: "this user does not exist" })
            }

            //mise à jour de l'utilisateur
            User.update(req.body, { where: { id: userId } })
                .then(user => res.json({ message: "User Uploaded" }))
                .catch(err => res.status(500).json({ message: "Database error", error: err }))
                .catch(err => res.status(500).json({ message: "Database Error", error: err }))
        })
}

exports.untrashUser = (req, res) => {
    let userId = parseInt(req.params.id)
    if(!userId) {
        return res.status(400).json({ message: "missing parameter"})
    }
    User.restore({ where: {id:userId}})
    .then(() => res.status(204).json({}))
    .catch(err => res.status(500).json({ message: "Database Error", error: err}))
}

exports.trashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: "Missing paramater" })
    }

    //suppression de l'utilisateur
    User.destroy({ where: { id: userId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: "Database Error", error: err }))
}

exports.deleteUser = (req, res) => {
    let userId = parseInt(req.params.id)

    //verification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: "Missing paramater" })
    }

    //suppression de l'utilisateur
    User.destroy({ where: { id: userId }, force: true })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: "Database Error", error: err }))
}