const userAuth = {
    "Name":{
        "type" : String,
        "required": true
    },
    "Email":{
        "type": String,
        "required": true
    },
    "Password": {
        "type": String,
        "required": false
    },
    "LoginType": {  //Google or from UI
        "type": String,
        "required": true
    },
    "UserType": { //Publisher or User
        "type": String,
        "required": true
    },
    "BooksWritten": [String], //Books ID from another collection
    "Chats": [String] //Chat Ids from another collection
}

const BooksWritten = {
    "AuthorId": {
        "type": String,
        "required": true
    },
    "AuthorName": {
        "type": String,
        "required": true
    },
    "Title": {
        "type":String,
        "required": true,
    },
    "ThumbnailURL": {
        "type":String,
        "required": true,
    },
    "Discription": {
        "type":String,
        "required": true,
    },
    "Tags": [String], //Tags Drama, advanture, comedy, action
    "BookData": {
        "type":String,
        "required": true,
    },
    "Views": {
        "type": Number,
        "required": true
    }
}

const Tags = {
    "Tag": String,
    "BooksId": [String] //IDs for BooksWritten
}

const Chats = {
    "Persons": {
        "type":String,
        "required": true,
    },
    "Chat" : [
        {
            "SenderId": String, //id
            "SendBy": String, //Name
            "Message": String
        }
    ]
}


module.exports = {
    Chats:Chats,
    BooksWritten: BooksWritten,
    userAuth: userAuth,
    Tags: Tags
}