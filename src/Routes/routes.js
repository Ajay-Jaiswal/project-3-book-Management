const express = require("express");
const router = express.Router()
const userController = require('../Controllers/userController')
const bookController = require('../Controllers/bookController')
const reviewController = require('../Controllers/reviewController')
const mid = require("../middleware/midfile")

//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My server is running awesome!")
})
//--------------------------------------------------------//

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)


router.post("/books", bookController.createBook)
router.get("/books",mid.authentication, bookController.getBooks)
router.get("/books/:bookId", mid.authentication, mid.authorization, bookController.getBookReviews)
router.put("/books/:bookId", mid.authentication, mid.authorization, bookController.updateBook)
router.delete("/books/:bookId", mid.authentication, mid.authorization, bookController.deleteBook)

router.post("/books/:bookId/review", reviewController.createReview)


module.exports = router