//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const express=require('express');
//(ADDITIONAL)
var multer  = require('multer')
const verifyToken = require('../auth/verifyToken');
//multer storage
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null,'./uploads');
    },
    filename: (req,file,callback) =>{
        callback(null, Date.now()+file.originalname);
    }
    
});

//filtering multer files
const fileFilter = (req,file,callback)=>{
    //accepting if jpg
    if (file.mimetype === 'image/jpeg'){
        //Store it
        callback(null, true);
    }
    else { //if NOT jpg
        callback(err, false);
    }
}
var upload = multer({ 
    storage: storage, 
    limits: {fileSize: 1024 * 1024}, //(1mb limit)
    fileFilter: fileFilter
})


//NOT additional
const users = require("../model/users");
const category = require("../model/category");
const games = require("../model/games");
const reviews = require("../model/reviews");


const path = require('path');
const util = require('util');

var app=express();

const cors = require("cors");
app.use(cors());

//making uploads folder public
app.use('/uploads', express.static('uploads'))

var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);
//=============================<<ASSIGNMENT 1>>=============================
// 1) Get all users
app.get("/users/", (req,res)=>{
    users.getUsers((err, result) => {
        if (!err) {  // not error
            res.status(200);
            res.type('application/json');
            res.json(result);
        } else {  // error
            res.status(500).send({Condition: "Unknown error"});
        }
    })
})

// 2) Add a user
app.post('/users/',(req,res)=>{ 
    console.log(req.body)
    const username = req.body.username;
    const email = req.body.email; 
    const type = req.body.type;
    const password = req.body.password
    const profile_pic_url = req.body.profile_pic_url;
 
    users.addUser(username, email, type, password, profile_pic_url,(err, result) => {
        if (!err) {
            res.status(201).send(result);
        } else{
            res.status(500).send({Condition: "Unknown error"});
        }
    }); 
})

// 3) Find a user by id
app.get('/user/:id', (req,res) => {
    const id = req.params.id;
    users.getUser(id, (err, result) => {
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown error"});
        }
    });
});

// 4) Add cat
app.post('/category/',(req,res)=>{ 
    const catname = req.body.catname;
    const description = req.body.description; 
    const type = req.body.type;
    //if the type of acc is not Admin, then cannot update.
    if (type != "Admin"){
        res.sendStatus(403);
    }
    else {
        category.addCat(catname, description, (err, result) => {
            if (!err) {
                res.sendStatus(204);
            } else{
                //if got dupe
                if (err.statusCode == 422){
                    res.status(422).send({Condition: "The category name provided already exists."})
                }
                else{
                    res.status(500).send({Condition: "Unknown error"});
                }
            }
        }); 
    }

})

// 5) Update a cat by id
app.put('/category/:id', (req, res) => {
    const catname = req.body.catname;
    const description = req.body.description; 
    const id = req.params.id;
    category.updateCat(catname, description, id, (err, result) => {
        if (!err) {
            res.sendStatus(204);
        } else{
            //if got dupe
            if (err.statusCode == 422){
                res.status(422).send({Condition: "The category name provided already exists."})
            }
            else{
                res.status(500).send({Condition: "Unknown error"});
            }
        }
    }); 
})

// 6) Add a game
app.post('/game',(req,res)=>{ 
    const title = req.body.title;
    const description = req.body.description; 
    const price = req.body.price;
    const platform = req.body.platform;
    const categoryid = req.body.catid;
    const year = req.body.year;
    const type = req.body.type;
    if (type!="Admin"){
        res.sendStatus(403);
    }
    else{
        games.addGame(title, description, price, platform, categoryid, year, (err, result) => {
            if (!err) {
                res.status(201);
                res.type('application/json');
                res.json(result);
            } 
            else{
                //if got dupe
                if (err.statusCode == 422){
                    res.status(422).send({Condition: "Game already exists."})
                }
                else {
                    res.status(500).send({Condition: "Unknown error"});
                }
            }
        }); 
    }

})

// 7) Get game by platform
app.get('/game/:platform', (req,res) => {
    const platform = req.params.platform;
    games.getPlatform(platform, (err, result) => {
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown error"});
        }
    });
});

// 8) Delete game by id
app.delete('/game/:id', (req, res)=>{
    const gameid = req.params.id;
    games.delGame(gameid, (err, result) => {
        if (!err) {
            res.sendStatus(204);
        } else {  // error
            res.status(500).send({Condition: "Unknown error"});
        }
    });
})

// 9) Update game by id
app.put('/game/:id', (req, res) => {
    const title = req.body.title;
    const description = req.body.description; 
    const price = req.body.price;
    const platform = req.body.platform;
    const categoryid = req.body.catid;
    const year = req.body.year;
    let gameid = req.params.id;

    games.updateGame(title, description, price, platform, categoryid, year, gameid, (err, result) => {
        if (!err) {
            res.sendStatus(204);
        } else{
            res.status(500).send({Condition: "Unknown error"});
        }
    }); 
})

// 10) Adds a new review
app.post('/user/:uid/game/:gid/review/', (req,res)=>{ 
    const userid = req.params.uid;
    const gameid = req.params.gid; 
    const content = req.body.content;
    const rating = req.body.rating;
 
    reviews.addReview(userid, gameid, content, rating, (err, result) => {
        if (!err) {
            res.status(201).send(result);
        } else{
                res.status(500).send({Condition: "Unknown error"});
        }
    }); 
})

//11) Get reviews by gameid
app.get("/game/:id/review", (req,res)=>{
    const gameid = req.params.id;
    reviews.getReviews(gameid, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown error"});
        }
    })
});


//additional ? 

//get category name
app.get("/catid/:catid", (req,res)=>{
    const catid = req.params.catid;
    category.getCatname(catid, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
});

//search for a game by name
app.get("/game/search/:search/:maxPrice", (req,res)=>{
    const search = req.params.search;
    const maxPrice = req.params.maxPrice;
    if (maxPrice == ""){
        maxPrice=100000;
    }
    games.search(search, maxPrice, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
});
//if search name empty, but got maxprice
app.get("/game/search//:maxPrice", (req,res)=>{
    const maxPrice = req.params.maxPrice;
    games.searchPrice(maxPrice, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
})

//if maxprice empty but got search name
app.get("/game/search/:search/", (req,res)=>{
    const search = req.params.search;
    var maxPrice = req.params.maxPrice;
    if (maxPrice == undefined){
        var maxPrice=100000; //set max price super high so that all games will be showed
    }
    games.search(search, maxPrice, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
});

//search for a game by catid
app.get("/game/catid/:catid", (req,res)=>{
    const catid = req.params.catid;
    games.findbyID(catid, (err,result)=>{
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
});

//Add game picture
app.post('/gamepic/:gameid', upload.single('gamePic'), (req, res)=>{
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body);
    const gameid = req.params.gameid;
    const pic = req.file;
    console.log(pic)
    games.addPic(gameid, pic, (err,result)=>{
        if (!err) {
            res.status(201).send(result);
        } else{
                res.status(500).send({Condition: "Internal Server Error"});
        }
    })
})

//show the game picture
app.get("/game/pic/:gameid", (req,res)=>{
    const gameid = req.params.gameid;
    games.showPic(gameid, (err,result)=>{
        if (!err) { 
            res.status(200).send({pic_url: result[0].pic_url});
        } else { 
            res.status(500).send({Condition: "Unknown Error"});
        }
    })
});

//=============================<<ASSIGNMENT 2>>=============================
//get all categories
app.get("/allCat/", (req,res)=>{
    category.getCat((err, result) => {
        if (!err) {  // not error
            res.status(200);
            res.type('application/json');
            res.json(result);
        } else {  // error
            res.status(500).send({Condition: "Unknown error"});
        }
    })
})

//get game by id
app.get('/games/:id', (req,res) => {
    const id = req.params.id;
    games.getGameID(id, (err, result) => {
        if (!err) { 
            res.status(200).send(result);
        } else { 
            res.status(500).send({Condition: "Unknown error"});
        }
    });
});
//Login User
app.post('/api/login/',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    users.loginUser(email,password,function(err,token,userInfo){
        if (userInfo == null){
            let loginResult = {
                success: false,
                token: null, 
                //(user info stored in local storage (client side) so need to make it become string)
                UserData: null,
                status: 'Incorrect Email/Password'
            };
            res.status(401).type('application/json').json(loginResult);
        }
        else if(!err){
            //can use delete to delete a property from an object
            delete userInfo[0].password;
            let loginResult = {
                success: true,
                token: token, 
                //(user info stored in local storage [client side]so need to make it become string)
                UserData: JSON.stringify(userInfo),
                status: 'You are successfully logged in!'
            };
            res.status(200).type('application/json').json(loginResult);
            //res.send("{\"result\":\""+result +"\"}");
        }
        else{
            res.status(500);
            res.send(err.statusCode);
        }
    });
});

// Get all games
app.get("/games/", verifyToken, (req,res)=>{
    games.getGames((err, result) => {
        if (!err) {  // not error
            res.status(200);
            res.type('application/json');
            res.json(result);
        } else {  // error
            res.status(500).send({Condition: "Unknown error"});
        }
    })
})
// Get all platforms
app.get("/platform/", (req,res)=>{
    games.getPlatforms((err, result) => {
        if (!err) {  // not error
            res.status(200);
            res.type('application/json');
            res.json(result);
        } else {  // error
            res.status(500).send({Condition: "Unknown error"});
        }
    })
})

//Catch all
app.use((req,res) => {
    res.status(404);
    res.type('text/html');
    res.end('<html><body>FILE NOT FOUND</body></html>');
});


module.exports=app;