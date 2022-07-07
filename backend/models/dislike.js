
/*const sauceValidation = require('..//************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require('sequelize')

/*******************************/
/*** Définition du modèle Post */
module.exports = (sequelize) => {
    return Dislike = sequelize.define('Dislike', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        post_id:{
            type: DataTypes.INTEGER(10),
            allowNull: false
        },

        
    }, { paranoid: true })  
}
