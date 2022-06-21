
/*const sauceValidation = require('..//************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require('sequelize')

/*******************************/
/*** Définition du modèle Post */
module.exports = (sequelize) => {
    return Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        title:{
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        content:{
            type: DataTypes.TEXT,
            defaultValue: '',
            allowNull: false,
        }
    }, { paranoid: true })           // Ici pour faire du softDelete
}


/****************************************/
/*** Ancienne Synchronisation du modèle */
// Cocktail.sync()
// Cocktail.sync({force: true})
// Cocktail.sync({alter: true})