/************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
//const { User } = require("../db.config")

/*******************************/
/*** Définition du modèle User */
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        lastname:{
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        firstname:{
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        nickname:{
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            validate:{
                isEmail: true,        // Ici une validation de données
            }
        },
        password:{
            type: DataTypes.STRING(64)
        },
        role: {
            type: DataTypes.STRING(10),
            defaultValue: 'user',
        }
    }, { paranoid: true })           // Ici pour faire du softDelete
    
    User.checkPassword = async (password, originel) => {
        return await bcrypt.compare(password, originel)
    }

    return User
}

/****************************************/
/*** Ancienne Synchronisation du modèle */
//User.sync()
//User.sync({force: true})
//User.sync({alter: true})