//create mini express app
const exp = require("express")
const userApi = exp.Router();

userApi.use(exp.json())
//import MongoClient
const mc = require("mongodb").MongoClient;

//export
module.exports = userApi;


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
userApi.get('/getusers', async(req, res, next)=>{

    let userList = await userCollectionObj.find().toArray()
    res.send({message: userList})
})

//http://localhost:4200/users/getusers/Ajay
userApi.get('/getusers/:username', async(req, res, next)=>{

    //getting username from url
    let userName = req.params.username;

    let userObj = await userCollectionObj.findOne({username: userName})

    if(userObj === null){
        res.send({message: "No user found"})
    }
    else{
        res.send({message: userObj})
    }
})








//http:localhost:4200/users/createuser  
userApi.post('/createuser', async(req, res, next)=>{

    //getting newuser details
    let newUser = req.body;

    //seraching for user
    let userObj =  await userCollectionObj.findOne({username:newUser.username})

    if(userObj === null){

        //inserting new user
        await userCollectionObj.insertOne(newUser)
        res.send({message: "New user created"})
    }
    else{
        res.send({message: "user already existed"})
    }

})

//http://localhost:4200/users/updateuser/<username>
userApi.put('/updateuser/:username', async(req, res, next)=>{

    //getuser name from url
    let modifieduser = req.body;

    //update
    await userCollectionObj.updateOne({username:modifieduser.username}, {$set: {...modifieduser}})
    res.send({message: "user updated"})

})

//http://localhost:4200/users/deleteuser/Ajay
userApi.delete('/deleteuser/:username', async(req, res, next)=>{

    //getusername from url
    let userName = req.params.username;

    //delete
    await userCollectionObj.deleteOne({username:userName})
    res.send({message: "user deleted"})

})



