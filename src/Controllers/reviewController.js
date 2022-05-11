const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel")
const { ConnectionPoolClosedEvent } = require("mongodb")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}


const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId
        let { reviewedBy, rating, review } = requestBody

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parameters.Please provide review details" })
        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer detail is required." })

        if (!isValid(rating)) return res.status(400).send({ status: false, message: "Rating is required." })

        if (!isValid(review)) return res.status(400).send({ status: false, message: "Review is required." })

        // if (!bookId == bookModel._id)
        //     return res.status(400).send({ status: false, message: "No such document is exist with this Id or it maybe deleted" })

        // const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        // if (!findBook) return res.status(404).send({ status: false, message: "No document found or it maybe deleted" })

        // const newReview = await reviewModel.findOneAndUpdate({ _Id: bookId }, { ...requestBody }, { $inc: { review: 1 }},{new:true}) //review:+1

        const newReview = await reviewModel.create(requestBody)
        return res.status(201).send({ status: true, message: "new review created successfully", data: newReview })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

module.exports.createReview = createReview