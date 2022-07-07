/************************************/
/*** Import des modules nécessaires */
const express = require('express');
const cors = require('cors');
const checkTokenMiddleware = require('./jsonwebtoken/check');
require("dotenv").config();
/************************************/
/*** Import de la connexion à la DB */
let DB = require('./db.config');

/*****************************/
/*** Initialisation de l'API */
const app = express();
const path = require('path');

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/***********************************/
/*** Import des modules de routage */
const user_router = require('./routes/user');
const post_router = require('./routes/post');
const like_router = require('./routes/like');
const dislike_router = require('./routes/dislike');

const auth_router = require('./routes/auth');

/******************************/
/*** Mise en place du routage */


app.use('/users', checkTokenMiddleware, user_router);
app.use('/posts', post_router);
app.use('/likes', like_router);
app.use('/dislikes', dislike_router);
app.use('/posts', post_router);
app.use('/auth', auth_router);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('*', (req, res) => res.status(501).send('What are you doing !?!'))


/********************************/
/*** Start serveur avec test DB */
DB.sequelize.authenticate()
    .then(() => console.log('Database connection OK'))
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`This server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        })
    })
    .catch(err => console.log('Database Error', err))
