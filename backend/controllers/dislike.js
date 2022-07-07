/***********************************/
/*** Import des module nécessaires */
const DB = require('../db.config');
const Like = DB.Like;
const Dislike = DB.Dislike;


/**************************************/
/*** Routage de la ressource Post */

exports.addRemove = async (req, res) => {
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;
    try{
        const alreadyLiked = await Like.findOne({ where : { user_id, post_id } });
        if(alreadyLiked) {
            return res.status(400).json({ error: "Vous ne pouvez pas disliker un post que vous avez déjà liké !"});
        }
;
        const alreadyDisliked = await Dislike.findOne({ where: { user_id, post_id }, attributes: ['id'] });
        const post = await Post.findOne({ where: {id: post_id }, attributes: ['dislikes'] });
        const dislikes = post.dislikes;
        let message, code
        if (!alreadyDisliked) {
            await Dislike.create({post_id, user_id});
            await Post.update({dislikes: dislikes + 1}, { where: { id: post_id } });
            message = 'Dislike ajouté !';
            code = "dislikeAdded";
        } else {
            await Dislike.destroy({ where: { user_id, post_id }, force: true });
            await Post.update({dislikes: dislikes - 1}, { where: { id: post_id } });
            message = 'Dislike retiré !';
            code = "dislikeRemoved";
        }
        
        return res.status(200).json({ message, code });
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}