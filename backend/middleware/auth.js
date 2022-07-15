const jwt = require('jsonwebtoken');

module.exports = (req, res, next, isAuthLevel = false) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const role = decodedToken.role;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else if(isAuthLevel && role !== "admin") {
            throw "L'utilisateur n'a pas les droits suffisants";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requete non authentifiée' });
    }
};