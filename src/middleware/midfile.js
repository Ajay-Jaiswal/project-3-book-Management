const jwt = require("jsonwebtoken");
const bookModel = require("../Models/bookModel");

const authentication = async function(req,res,next){
    try{
        let token  = (req.headers["x-api-key"])
        let secretKey = "Group41-book/management"

        if (!token){
        return res.status(400).send({status: false, msg: "Token must be present",});
        }

        let decodedToken = jwt.verify(token, secretKey)

        if(!decodedToken){
        return res.status(400).send({status: false, msg: "Authentication error"});
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
        let bookId =req.param.bookId

        let id = req.userId  //decodedToken = req.decodedToken

        const findBook = await bookModel.findOne({_Id:bookId, isDeleted:false})

        if(!findBook)
        res.status(401).send({status: false, msg: "No book found or it maybe deleted"});

        if(id != findBook.userId){
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