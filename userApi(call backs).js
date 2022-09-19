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
userApi.get('/getusers', (req, res, next)=>{

    //read docs from user collection
    userCollectionObj.find().toArray((err, userList)=>{
        //deal with the error
        if(err){
            console.log("Error in reading user data", err);
            res.send({message: err.message})
        }
        else{
            res.send({message: userList})
        }
    })


})


//http://localhost:4200/users/getusers/Ajay
userApi.get('/getusers/:username', (req, res)=>{

    //get username for url parameter
    let userName = req.params.username;

    //search for user   
    userCollectionObj.findOne({username:userName},(err, userObj)=>{

        if(err){
            console.log("Error in reading userlist", err);
            res.send({message: err.message})
        }
        
        if(userObj === null){
            res.send({message: "User not found"})
        }
        else{
            res.send({message: userObj})
        }
    })

})

//http:localhost:4200/users/createuser  
userApi.post('/createuser', (req, res)=>{
    let newUser = req.body
    
    //check for user with username existed
    userCollectionObj.findOne({username:newUser.username}, (err, userObj)=>{
        if(err){
            console.log("Error in reading userlist", err);
            res.send({message: err.message})
        }
        
        //if user is not found, then we need to create new user
        if(userObj === null){
            userCollectionObj.insertOne(newUser, (err, sucess)=>{

                if(err){
                    console.log("Error in reading userlist", err);
                    res.send({message: err.message})
                }
                else{
                    res.send({message: "new User created"})
                }

            })
            
        }
        else{
            res.send({message: "user is already existed"})
        }
    })
})

//https://localhost:4200/users/updateuser/<username>
userApi.put('/updateuser/:username',(req, res, next)=>{

    let userModified = req.body

    //search for user
    userCollectionObj.updateOne({username:userModified.username},{
        $set:{...userModified}}, (err, sucess)=>{
            if(err){
                console.log("Error in reading userlist", err);
                res.send({message: err.message})
            }
            else{
                res.send({message: "user updated"})
            }

        })

})


//http://localhost:4200/users/deleteuser/Ajay
userApi.delete('/deleteuser/:username', (req, res, next)=>{

    let userName = req.params.username;

    //deleteuser
    userCollectionObj.deleteOne({username:userName}, (err, success)=>{
        if(err){
            console.log("Error in reading userlist", err);
            res.send({message: err.message})
        }
        else{
            res.send({message: "user deleted"})
        }
    })


})



//export
module.exports = userApi;

userApi.get("/getusers", (req, res)=>{
    res.send({message: "reply to user request"})
})
