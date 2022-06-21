//import des modules nécessaires

const jwt = require("jsonwebtoken")

//Extraction du token
const extractBearer = authorization => {
    if(typeof authorization !== 'string'){
        return false
    }

    //On isole le token
    const matches = authorization.match(/(Bearer)\s+(\S+)/i)

    return matches && matches[2]
}

//// Verification de la presence du token
const checkTokenMiddleware = (req, res, next) => {
    console.log(req.headers.authorization);
    const token = req.headers.authorization && extractBearer(req.headers.authorization)
    if(!token){
        return res.status(401).json({message: 'le petit malin'})
    }

    //verification la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err){
            return res.status(401).json({message: " bad token"})
        }
        next()
    })
}

module.exports = checkTokenMiddleware