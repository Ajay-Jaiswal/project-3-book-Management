const express = require("express")
const bodyParser = require('body-parser')
const route = require('./Routes/routes')
const  mongoose = require("mongoose")
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Rubi_db:T2P9R5d5lWl7SRAF@cluster0.tvyoi.mongodb.net/group41Database",{
    useNewUrlParser : true
})

.then(()=>"MongoDBb is connected")
.catch(err=> console.log(err))

app.use('/', route)

app.listen(process.env.Port || port, function () {
    console.log("Express is running on port " +(process.env.Port || port))
})
