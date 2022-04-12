const express = require("express");
var bodyparser = require("body-parser");
const mongodb =  require("mongoose");
const path = require("path");
const models = require("./model/models");
var crypto = require('crypto');



const app = express();

var urlencodedParser = bodyparser.urlencoded({ extended: false })

const PORT = process.env.PORT || 8000


app.use(bodyparser.json());



mongodb.connect("mongodb+srv://BookWorm:YIYKy0BkYX7mGVRv@cluster0.lz8cz.mongodb.net/BookWorm",{useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => console.log(" WORKING"))
    .catch( (error) => console.log("NOT WORKING ", + error));



app.use(express.static(path.join(__dirname, "build")));


//MongoDb Schema
const userAuthSchema = new mongodb.Schema(models.userAuth);
const ChatsSchema = new mongodb.Schema(models.Chats);
const BooksWrittenSchema = new mongodb.Schema(models.BooksWritten);
const TagsSchema = new mongodb.Schema(models.Tags);


//MongoDb Models
const userAuth = new mongodb.model("UserAuth" ,  userAuthSchema);
const Chats = new mongodb.model("Chats" ,  ChatsSchema);
const BooksWritten = new mongodb.model("BooksWritten" ,  BooksWrittenSchema);
const TagsMongoDb = new mongodb.model("Tags" ,  TagsSchema);



var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
var mystr = mykey.update('abc', 'utf8', 'hex')
mystr += mykey.final('hex');


app.post("/api/newChatData/:chatUserId", urlencodedParser,function(req, res){
    const newUserId = req.params["chatUserId"];
    const logedInUser = req.body["UserId"]
    var generatedChatId = "";
    if(newUserId <= logedInUser){
        generatedChatId = newUserId+ "-" + logedInUser;
    }
    else{
        generatedChatId = logedInUser+ "-" + newUserId;
    }

    console.log("new User Id - -----------", newUserId)

    const run =  async ()=>{
        //Get the chat of this person 
        const getChat = await Chats.find({"Persons": generatedChatId})
        const getUserInfo = await userAuth.find({"_id": newUserId}).select({
            "Name": 1
        })

        console.log(getChat, "getChats");
        console.log(getUserInfo, "getUserInfo");
        res.json({
            ChatData: getChat,
            userInfo: getUserInfo[0],
            message:"DATA_RETRIVED"
        })

    }
    if(newUserId === logedInUser){
        res.json({
            "message": "IDS_CANNOT_BE_SAME"
        })
    }
    else{
        run()
    }



})


//Retrive all chats from the database
app.get("/api/chatData/:id", function(req, res){ //UserLogedInId
    const id = req.params["id"]
    const run = async ()=>{
        const allChatIds = await userAuth.find({"_id": id}).select({
            "Chats": 1
        })
        console.log(allChatIds);
        const arrOfIds = [];
        allChatIds[0]["Chats"].forEach(chat =>{
            const a = chat.split("-");
            if (a[0] === id){
                arrOfIds.push(a[1])
            }
            else{
                arrOfIds.push(a[0])
            }
        })

        const getUsers = await userAuth.find({
            '_id': { $in: arrOfIds}
        }).select({
            "Name": 1
        })


        // const allChats = await Chats.find({
        //         '_id': { $in: allChatIds[0]["Chats"]}
        // });

        console.log(getUsers, "users");
        res.json({
            "users": getUsers
        })
    }
    if(id !== undefined){
            run();
    }

})


//Add message into the database
app.post("/api/message",urlencodedParser ,  function(req, res){
    const a = req.body["senderId"];
    const b = req.body["reciverId"];

})

app.get("/api/read/:title", function(req, res){
    const title = req.params["title"]
    //Increase the count
    const run = async () =>{
        const data = await BooksWritten.find({"Title": title})
     
        
        if(data.length === 0){
            res.json({
                "message": "NOT_FOUND"
            })
        }
        else{
            const _id = data[0]["_id"]
            const views = data[0]["Views"]
            data[0]["Views"] +=1;


            const result = await BooksWritten.updateOne({_id: _id},{
                $set :{
                    Views: views+1
                }
            });

            res.json({
                "message": "FOUND",
                data: data[0]
            })
        }
    }
    run();



})


app.get("/api/Books/:userid/:Type", function(req, res){
    const type= req.params["Type"]
    const UserId = req.params["userid"]
    console.log(type, UserId);

    const run = async ()=>{
          if(type === "Recent"){
              const data = await BooksWritten.find();
        
              res.json({
                  "message": "RECENTLY_ADDED",
                  "Data": data
              })
            }
            else if(type == "My"){
                const ids = await userAuth.find({"_id": UserId}).select({
                    BooksWritten: 1
                })
              
                const a =  await BooksWritten.find(
                    {'_id': { $in: ids[0]["BooksWritten"]}
                });
                
              

                res.json({
                    "message": "MY_BOOKS",
                    "Data": a
                })

            }
            else{
                const ids = await TagsMongoDb.find({"Tag": type}).select({
                    "BooksId": 1
                })
               

                const a =  await BooksWritten.find(
                    {'_id': { $in: ids[0]["BooksId"]}
                });
         

                res.json({
                    "message": "BOOKS_BY_TAG",
                    "Data": a
                })
            }
    }

    run();
  



})




app.post("/api/signup",urlencodedParser, function(req, res){
    const Name = req.body["Name"];
    const Email = req.body["Email"];
    const LoginType = req.body["LoginType"];
    const UserType = req.body["UserType"];
    const Password = req.body["Password"];
    const addUser  = async ()=>{
        const user = new userAuth({
            Name:Name,
            Email: Email,
            LoginType: LoginType,
            UserType: UserType,
            Password:Password,
            BooksWritten: [],
            Chats: []
        })
        const result = await userAuth.insertMany([user]);
        res.json({
            message: "USER_ADDED"
        })

    }

    const checkForUser = async () =>{
        const users = await userAuth.find({Email: Email})
        if(users.length === 0){
            addUser();
        }
        else{
            res.json({
                message: "USER_ALREADY_PRESENT"
            })
        }

    }

    checkForUser();
})



app.post("/api/login",urlencodedParser, function(req, res){
    const Email = req.body["Email"];
    const LoginType = req.body["LoginType"];
    const Password = req.body["Password"];

    const LoginUser = async () =>{
        const users = await userAuth.find({Email: Email , LoginType: LoginType, Password: Password}).select({
            "Email":1,
            "LoginType": 1,
            "UserType": 1,
            "Name": 1
            })
        if(users.length === 0){
            res.json({
                message: "USER_NOT_FOUND"
            })
        }
        else{
            res.json({
                message: "USER_LOGIN_SUCCESSFUL",
                data: users[0]})

        }

    }

    LoginUser();

})


app.post("/api/write", urlencodedParser, function(req, res){
    const Title = req.body["Title"];
    const ThumbnailURL = req.body["ThumbnailURL"];
    const Discription = req.body["Discription"];
    const Tags = req.body["Tags"];
    const BookData = req.body["BookData"];
    const id = req.body["UserId"];
    const AuthorName = req.body["AuthorName"];

    //Get the tags and add the id into them

    const addDataIntoBooksWritten = async ()=>{
        const users = await BooksWritten.find({Title: Title})
        if(users.length !== 0){
            res.json({
                message: "TITLE_ALREADY_PRESENT"
            })
        }
        else{
            const BooksWrittenData = new BooksWritten({
                AuthorId:id,
                Title:Title,
                ThumbnailURL: ThumbnailURL,
                Discription: Discription,
                Tags: Tags,
                BookData:BookData,
                AuthorName: AuthorName,
                Views: 0
            })

            const result = await BooksWritten.insertMany([BooksWrittenData]);
            console.log( "Result in BookWriten", result[0]["_id"])
            await userAuth.findOneAndUpdate(
                { _id: id },
                { $push: { BooksWritten: result[0]["_id"] } },
                { upsert: true }
              );
              res.json({
                message: "BOOK_ADDED"
            })


            const addInTag = async (tag) =>{
                await TagsMongoDb.findOneAndUpdate(
                    {Tag: tag},
                    { $push: { BooksId: result[0]["_id"] } },
                    { upsert: true }
                )
            }

            Tags.forEach(tag =>  {
                addInTag(tag);                
            });




        }


    }
    addDataIntoBooksWritten()


})






















app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})


app.get('/Login', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/SignUp', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get("/read/:title", function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/chat', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/chat/:id', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get("/write", function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})


const server = app.listen(PORT, function (){
    console.log("Server is running");

})

const io = require("socket.io")(server, {
    pingTimeout: 60000
})

io.on("connection", (socket)=>{
    console.log("connect to socket ")
    socket.on("setup", (userData) =>{
        socket.join(userData._id);
        console.log(userData._id, "working1");
        socket.emit("connected");
    })


    socket.on('join chat', (room) =>{
        socket.join(room);
        console.log("\n\nUser joined Room", room);
    })

    socket.on("new message", (newMessageRecived) => {
        console.log(newMessageRecived, "messageRecived");
        // var chat = newMessageRecived.chat;
        // if(!chat.users) return console.log("chat user not defined");

        // chat.users.forEach(user => {
        //     socket.in(user._id).emit("message recived" , newMessageRecived);
        // })
        socket.in(newMessageRecived.roomId).emit("message recieved", newMessageRecived);

        const run = async ()=>{
            //find if chat id is present or not 
            //if not add it also in userAuth or both parties
            //if present push the chat only in that 
            const cdata = {
                "SenderId": newMessageRecived.senderId,
                "SendBy": newMessageRecived.senderName, //Name
                "Message": newMessageRecived.message
            }
            const chatPresent = await Chats.find({"Persons": newMessageRecived.roomId});
            if(chatPresent.length === 0){
                const arr = newMessageRecived.roomId.split("-")
                const addIntoPerson1 = await userAuth.findOneAndUpdate(
                    {"_id": arr[0]},
                    { $push: { "Chats": newMessageRecived.roomId} },
                    { upsert: true }
                )

                const addIntoPerson2 = await userAuth.findOneAndUpdate(
                    {"_id": arr[1]},
                    { $push: { "Chats": newMessageRecived.roomId} },
                    { upsert: true }
                )

                const chData = new Chats({
                    "Persons": newMessageRecived.roomId,
                    "Chat": [cdata]
                })

                const addChat = await Chats.insertMany([chData]);


            }
            else{
           

            const addChats = await Chats.findOneAndUpdate(
                {"Persons": newMessageRecived.roomId},
                { $push: { "Chat": cdata} },
                { upsert: true }
            )


            }

    
        }
        run();
        


})


})