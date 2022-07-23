//module nécessaire

/************************************/
/*** Import des modules nécessaires */
const { Sequelize } = require('sequelize')
/************************************/
/*** Connexion à la base de données */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

/*** Mise en place des relations */
const db = {};

db.sequelize = sequelize;
db.User = require('./models/user')(sequelize);
db.Post = require('./models/post')(sequelize);
db.Like = require('./models/like')(sequelize);
db.Dislike = require('./models/dislike')(sequelize);

db.Post.belongsTo(db.User, {foreignKey: 'user_id', onDelete: 'cascade'});
db.Like.belongsTo(db.User, {foreignKey: 'user_id', onDelete: 'cascade'});
db.Like.belongsTo(db.Post, {foreignKey: 'post_id', onDelete: 'cascade'});
db.Dislike.belongsTo(db.User, {foreignKey: 'user_id', onDelete: 'cascade'});
db.Dislike.belongsTo(db.Post, {foreignKey: 'post_id', onDelete: 'cascade'});

/*********************************/
/*** Synchronisation des modèles */
// sequelize.sync(err => {
//     console.log('Database Sync Error', err)
// })
db.sequelize.sync();
//
/*app.post('/test', function (request, response) {
    return await users.create({
        id: request.body.id,
        name: request.body.name,
        role: request.body.role,
        email: request.body.email
    }).then(function (users) {
        if (users) {
            response.send(users);
        } else {
            response.status(400).send('Error in insert new record');
        }
    });
}*/


module.exports = db

//pas d 'admin crée lors du clonage, création d'un adminstrateur