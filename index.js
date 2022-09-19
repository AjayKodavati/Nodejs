//import
const exp = require("express")

//create object
const app = exp()


//import Apis
const userApi = require("./APIS/usersApi")
const productApi = require("./APIS/productApi") 


//executing specific api based on path
app.use("/users", userApi)
app.use("/product", productApi)


//invalid path middleware
app.use((req, res, next)=>{
    res.send(`Invalid path ${req.url}....`)
})

//error handling middleware
app.use((err, req, res, next)=>{
    res.send({message: err.message})
})

const port = 4200
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.....`)
})
