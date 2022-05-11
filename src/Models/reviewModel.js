const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId : {
        type:ObjectId,
        trim:true,
        required: [true, "Book ID is required"],
        refs: "Book"
    },
    reviewedBy: {
        type: String, 
        required: [true, "Reviewer detail is required"], 
        default :'Guest', 
        value: { type: String}        //reviewer's name
    },
    reviewedAt: {
        type: Date, 
        format: ("YYYY-MM-DD"),
        required: [true, "Review detail is required"]
    
    },
    rating: {
        type: Number, 
        min :1, 
        max :5, 
        required: [true, "Rating is required"]
    },
    review: {
        type: String, 
        optional :  true
    },
    isDeleted: {
        type : Boolean, 
        default: false
    }

})

module.exports = mongoose.model("Review",reviewSchema)