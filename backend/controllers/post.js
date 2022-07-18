/***********************************/
/*** Import des module nécessaires */
const DB = require('../db.config');
const Post = DB.Post;
const User = DB.User;
const fs = require('fs');
/**************************************/
/*** Routage de la ressource Post */

exports.getAllPosts = (req, res) => {

    Post.findAll({
        paranoid: false,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ["nickname"] }],
        attributes: {
            include: [
                DB.sequelize.literal("SUBSTRING(post.content, 1, 150) as content"),
                "title", "likes", "dislikes", "imageUrl", "updatedAt", "user_id", "id"
            ]
        }

    }).then(posts => {
        res.status(200).json(posts);
    }).catch(err => {
        res.status(500).json({ message: 'Database Error', error: err });
    })
}

exports.getOne = async (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try {
        // Récupération du post
        let post = await Post.findOne({
            where: { id: postId },
            include: [{ model: User, attributes: ["nickname"] }],
            attributes: [
                "id", "title", "content", "likes", "dislikes", "imageUrl", "updatedAt"
            ]
        })

        // Test si résultat
        if (post === null) {
            return res.status(404).json({ message: 'This post does not exist !' })
        }

        // Renvoi du post trouvé
        return res.json({ post })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.getContent = async (req, res) => {
    let postId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try {
        // Récupération du post
        let post = await Post.findOne({ where: { id: postId }, attributes: ['content'] })

        // Test si résultat
        if (post === null) {
            return res.status(404).json({ message: 'This post does not exist !' })
        }

        // Renvoi du post trouvé
        return res.json({ post })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.addPost = async (req, res) => {
    const { title, content, user_id } = req.body;

    // Validation des données reçues
    if (!user_id || !title || !content) {
        if (req.file && req.file.filename) {
            fs.unlink(`images/${req.file.filename}`, async () => {
                return res.status(400).json({ message: 'Missing Data' });
            });
        } else {
            return res.status(400).json({ message: 'Missing Data' });
        }
    }

    try {
        // Céation du post
        const dataToPost = { title, content, user_id };
        if (req.file && req.file.filename) {
            dataToPost.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        const post = await Post.create(dataToPost);
        return res.json({ message: 'Post Created', data: post })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.updatePost = async (req, res) => {
    let postId = parseInt(req.params.id);
    const { title, content, oldImageUrl } = req.body;

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' });
    }

    try {
        // Recherche du post et vérification
        let post = await Post.findOne({ where: { id: postId }, raw: true });
        if (post === null) {
            return res.status(404).json({ message: 'This post does not exist !' });
        }

        const dataToPost = { title, content };

        if (req.file && req.file.filename) {
            dataToPost.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        if (oldImageUrl) {
            if (!dataToPost.imageUrl) dataToPost.imageUrl = "";
            const filename = post.imageUrl.split('/images/')[1];
            //supprimer le fichier ayant ce filename
            console.log(filename);
            fs.unlink(`images/${filename}`, (err) => {
                Post.update(dataToPost, { where: { id: postId } }).then(updated => {
                    return res.status(200).json({ message: 'post Updated' });
                }).catch(err2 => {
                    console.log(err2)
                    return res.status(500).json({ message: 'Database Error', error: err2 })
                })
            });
        } else if (req.file && req.file.filename) {
            dataToPost.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            await Post.update(dataToPost, { where: { id: postId } });
            return res.status(200).json({ message: 'post Updated' });
        } else {
            await Post.update(dataToPost, { where: { id: postId } });
            return res.status(200).json({ message: 'post Updated' });
        }


        // Mise à jour du post

    } catch (err) {
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

exports.deletePost = async (req, res) => {
    let postId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!postId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    const postToDelete = await Post.findOne({ where: { id: postId } });
    // Suppression du post
    if (postToDelete.imageUrl) {
        fs.unlink(`images${postToDelete.imageUrl.split('images')[1]}`, async () => {
            destroyPost(res, postId);
        });
    } else {
        destroyPost(res, postId);
    }
}

const destroyPost = (res, postId) => {
    Post.destroy({ where: { id: postId }, force: true })
        .then(result => {
            return res.status(204).json({});
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}