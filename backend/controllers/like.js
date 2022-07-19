/***********************************/
/*** Import des module nécessaires */
const DB = require('../db.config')
const Like = DB.Like
const DisLike = DB.Dislike


/**************************************/
/*** Routage de la ressource Post */

exports.addRemove = async (req, res) => {
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;
    try{
        const alreadyDisliked = await DisLike.findOne({ where : { user_id, post_id } });
        if(alreadyDisliked) {
            return res.status(400).json({ message: "Vous ne pouvez pas liker un post que vous avez déjà disliké !"});
        }

        const alreadyliked = await Like.findOne({ where: { user_id, post_id }, attributes: ['id'] });
        const post = await Post.findOne({ where: {id: post_id }, attributes: ['likes'] });
        const likes = post.likes; 
        let message, code;
        if (!alreadyliked) {
            await Like.create({post_id, user_id});
            await Post.update({likes: likes + 1}, { where: { id: post_id } });
            message = 'Like ajouté !';
            code = "likeAdded";
        } else {
            await Like.destroy({ where: { user_id, post_id }, force: true });
            await Post.update({likes: likes - 1}, { where: { id: post_id } });
            message = 'Like retiré !';
            code = "likeRemoved";
        }
        
        return res.status(200).json({ message, code });
    }catch(err){
        return res.status(500).json({ message: 'Une erreur inconnue est survenue', error: err })
    }
   
    


}
