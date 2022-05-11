const mongoose = require("mongoose")
const bookModel = require("../Models/bookModel")
const userModel = require("../Models/userModel")
const reviewModel = require("../Models/reviewModel")
// const ObjectId = mongoose.Schema.Types.isValid(ObjectId)

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}
const titleRegex = /^[a-zA-Z ]{2,45}$/              //  /^[a-zA-Z\\s]*$/   <--- will not consider space between


const createBook = async function(req,res){
    try{
        let bookData = req.body
        let {title,excerpt,userId,ISBN,category,subcategory,reviews,releasedAt} = bookData

        if (!isValidRequestBody(bookData)) return res.status(400).send({ status: false, message: "No input by user.." })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required." })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt are required." })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "User Id is required." })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number is required." })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Category is required." })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is required."})
        if (!isValid(reviews)) return res.status(400).send({ status: false, message: "Reviews is required." })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "Release date is required."})

        if (!titleRegex.test(title)) return res.status(400).send({ status: false, message: " Please provide valid title including characters only."})

        if(!bookData.userId == userModel._id)
        return res.status(400).send({status:false, message: "No such user is found with this Id"})

        const newBook = await bookModel.create(bookData)
        return res.status(201).send({status:true, message: "New book created sucessfully", data: newBook})
        

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const getBooks = async function(req,res){
    try{


        // const userQuery = req.query
        let userId = req.query.userId 
        if (!isValidRequestBody(userId)) return res.status(400).send({ status: false, message: "No query inputs by user." })


        const getbookdata = await bookModel.find({userId:userId , isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1,userId: 1, category : 1, releasedAt:1 }).sort({title : 1})
        if (!getbookdata) return res.status(404).send({ status: false, message: "No document found or it maybe deleted" })


        if(!userId == userModel._id)
        return res.status(400).send({status:false, message: "No such user is found with this Id"})

        return res.status(200).send({status:true, message: "Books list", data: getbookdata})
        

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const getBookReviews = async function(req,res){
    try{
        const requestBody = req.params.bookId

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "No input by user." })

        const getbookdata = await bookModel.findOne({_id:requestBody, isDeleted: false })

        if (!getbookdata) return res.status(404).send({ status: false, message: "No document found or it maybe deleted" })


        const findReview = await reviewModel.find({bookId:requestBody, isDeleted: false})
        if (!findReview) return res.status(404).send({ status: false, message: "No review document found or it maybe deleted" })

        const booksList = ({
            data : getbookdata,
            reviewsData : findReview
        })

        return res.status(200).send({status:true, message: "Books list", data: booksList})

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const updateBook = async function(req,res){
    try{
        let bookId = req.params.bookId
        let requestBody = req.body

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parameters.Please provide the fields that you want to update" })


        const getbook = await bookModel.findOne({_id:bookId, isDeleted: false })

        if (!getbook) return res.status(404).send({ status: false, message: "No document found or it maybe deleted" })

        const updateBook = await bookModel.findOneAndUpdate({id:bookId},{...requestBody},{new:true})

        return res.status(200).send({status: true, message:"successfully updated",data:updateBook})

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const deleteBook = async function(req,res){
    try{
        let bookId = req.params.bookId

        const getbook = await bookModel.findOne({_id:bookId, isDeleted: false })

        if (!getbook) return res.status(404).send({ status: false, message: "No document found or it maybe deleted" })

        const deleteBook = await bookModel.findOneAndUpdate({id:bookId},{$set:{isDeleted:true, deletedAt: Date.now() }},{new:true})

        return res.status(200).send({status: true, message:"successfully updated",data:deleteBook})

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBookReviews =getBookReviews
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook