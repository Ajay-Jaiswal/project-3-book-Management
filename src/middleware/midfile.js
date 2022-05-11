const jwt = require("jsonwebtoken");

const authentication = async function(req,res,next){
    try{
        let token  = (req.headers["x-api-key"])

        if (!token){
        return res.status(400).send({status: false, msg: "Token must be present",});
        }

        let decodedToken = jwt.verify(token, "user-book")

        if(!decodedToken){
        return res.status(400).send({status: false, msg: "Token is invalid"});
        }
        let userLoggedIn = decodedToken.userId
        req["userId"] = userLoggedIn

        next()

    }
    catch (err){
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const authorization = async function(req,res,next){
    try{
        let userId =req.param.userId
        let id =req.userId

        if(!id)
        res.status(401).send({status: false, msg: "user Id must be present"});

        if(id != userId){
            next()
        }else{
            res.status(401).send({status: false, msg: "user logged in is not allowed to modify or access the author data"});
        }
    }

catch (err){
    res.status(500).send({ msg: "Error", error: err.message })
}

}

module.exports.authentication = authentication
module.exports.authorization = authorization