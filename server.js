/*the main drawback with http module is that we need to write multiple if conditions if there are multiple calls 
made to the server, which increser the time to find the exact request handler.
*/

//import
const http=require('http')

//creating server
const server=http.createServer((req,res)=>{

    //GET request handler
    if(req.method === "GET"){

       if(req.url === "/getusers"){
           res.end("Users data")
       }

       if(req.url === "/getproducts"){
           res.end("Products data");
       }
    }

    //POST request Handler
    if(req.method === "POST"){
        
        if(req.url === "/createuser"){
            res.end("user created")
        }

        if(req.url === '/createproduct'){
            res.end("product created")
        }
    }
});

//assign port number
server.listen(2000,()=>console.log("server listening on 2000..."))