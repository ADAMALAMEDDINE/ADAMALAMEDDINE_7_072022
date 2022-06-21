/***********************************/
/*** Import des module nécessaires */
const DB = require('../db.config')
const Post = DB.Post
const User = DB.User

/**************************************/
/*** Routage de la ressource Post */

exports.getAllPosts = (req, res) => {
Post.findAll({paranoid: false})
        .then(posts => res.json({ data: posts }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getPost = async (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try {
        // Récupération du post
        let post = await Post.findOne({ where: { id: postId }, include: {model: User, attributes:['id','pseudo','email']} })

        // Test si résultat
        if (post === null) {
            return res.status(404).json({ message: 'This post does not exist !' })
        }

        // Renvoi du post trouvé
        return res.json({ data: post })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.addPost = async (req, res) => {
    const { title, content, user_id } = req.body

    // Validation des données reçues
    if (!user_id || !title || !content ) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Céation du post
        const post = await Post.create(req.body)
        return res.json({ message: 'Post Created', data: post })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.updatePost = async (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche du post et vérification
        let post = await Post.findOne({ where: { id: postId }, raw: true })
        if (post === null) {
            return res.status(404).json({ message: 'This post does not exist !' })
        }

        // Mise à jour du post
        await Post.update(req.body, { where: { id: postId } })
        return res.json({ message: 'post Updated' })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.untrashPost = (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    Post.restore({ where: { id: postId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.trashPost = (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression du post
    Post.destroy({ where: { id: postId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.deletePost = (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression du post
    Post.destroy({ where: { id: postId }, force: true })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}