//create mini express app
const exp = require("express")
const userApi = exp.Router();

userApi.use(exp.json())
//import MongoClient
const mc = require("mongodb").MongoClient;

//connection string
const databseUrl= "mongodb+srv://Alekhya:0411@cluster0.wkp3w5s.mongodb.net/?retryWrites=true&w=majority"
let userCollectionObj

//connect to db
mc.connect(databseUrl, {useNewUrlParser:true, useUnifiedTopology:true},(err, client)=>{

    if(err){
        console.log("error in database connection", err.message);
    }
    else{

        //get databse object
        let databaseObj = client.db("Backend");

        //create user collection object
        userCollectionObj = databaseObj.collection("usercollection")
        console.log("connected to database")
    }
    
})


//http://localhost:4200/users/getusers
userApi.get('/getusers',(req, res, next)=>{

    userCollectionObj.find().toArray()
        .then(userList => {res.send({message: userList})
            })
        .catch(err => console.log("error in getting user data", err.message))

})

//http://localhost:4200/users/getusers/Ajay
userApi.get('/getusers/:username', (req, res, next)=>{

    //getting username from url
    let userName = req.params.username;

    userCollectionObj.findOne({username:userName})
        .then(userObj=>{

            if(userObj === null){
                res.send({message: `No user found `})
            }
            else{
                res.send({message: userObj})
            }
            
        })
        .catch(err=>{
            console.log("error in getting users data", err)
            res.send({message: err.message})
        })

})








//http:localhost:4200/users/createuser  
userApi.post('/createuser', (req, res, next)=>{

    //getting newuser details
    let newUser = req.body;

    userCollectionObj.findOne({username: newUser.username})
    .then(userObj =>{
        if(userObj === null){
            userCollectionObj.insertOne(newUser)
             .then(sucess=>{
                res.send({message: "user created sucessfullly"})
             })
             .catch(err => {
                console.log({message: err.message})
             })
        }
        else{
            res.send({message: "user already existed"})
        }
    })
    .catch(err => {
        console.log("error in creating new user", err)
        res.send({message: err.message})
    })

})








//https://localhost:4200/users/updateuser/<username>
userApi.put('/updateuser', (req, res, next)=>{

    //get username
    let modidfiedUser = req.body
    userCollectionObj.updateOne({username:modidfiedUser.username}, {$set:{...modidfiedUser}})
        .then(sucess=>{
            res.send({message: "user updated sucessfully"})
        })
        .catch(err =>{
            console.log("error in updateing user profile")
        })


})


//http://localhost:4200/users/deleteuser/Ajay
userApi.delete('/deleteuser/:username', (req, res, next)=>{

    //getusername from url
    let userName = req.params.username;

    userCollectionObj.deleteOne({username:userName})
        .then(sucess => {
            res.send({message: "user deleted"})
        })
        .catch(err => {
            console.log("error in deleting user", err.message)
        })

})



//export
module.exports = userApi;

userApi.get("/getusers", (req, res)=>{
    res.send({message: "reply to user request"})
})
