var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var ejs=require("ejs")
var multer = require('multer');


const path = require('path');
var fs = require('fs');


const app = express()
app.set("view engine", "ejs");



app.use(bodyParser.json())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://manokarthi:mano2412@cluster0.gcxfd3u.mongodb.net/?retryWrites=true&w=majority')

var db =mongoose.connection;

db.on('error',()=>console.log("Error in Connection to database"));
db.once('open',()=>console.log("Connected to Database"))








var imageSchema = new mongoose.Schema({
    name: String,
    blog: String,
    img:
    {
        data: Buffer,
        contentType: String
    }},
    { 
        collection:'blogs'
    
});
  
  
module.exports =imgModel= new mongoose.model('Image', imageSchema);




var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });








app.get('/blog',function(req,res){
    res.render('imagepage')
})

app.post('/blog_post', upload.single('image'), (req, res, next) => {


    var obj = {
        name: req.body.name,
        blog: req.body.blog,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('creatorstudio');
        }
    });
});

app.post("/blog_post",(req,res)=>{
    
    var name=req.body.name;
    var blog=req.body.blog;
    
    
    
    var data={
        "title":name,
        "blog":blog
        
    }
    db.collection('blog').insertOne(data,(err,collection)=>{
       
        if(err){
            throw err;
        }
        console.log("Record Inserted successfully");
    })
    
})

app.get('/studio',function(req,res){
    res.render('creatorstudio')
})

app.get('/explore',function(req,res){
    res.render('explore')
})

app.get('/signup',function(req,res){
    res.render('signup')
})

app.get('/about',function(req,res){
    res.render('about')
})


app.post("/sign_up",(req,res)=>{
    var name=req.body.name;
    var password = req.body.password;
    
    var data={
        "name":name,
        "password":password
    }
    db.collection('login').insertOne(data,(err,collection)=>{
       
        if(err){
            throw err;
        }
        console.log("Record Inserted successfully");
    })
    return res.redirect('home')
})


app.get('/home',function(req,res){
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('home', { items: items });
        }
    });
});



app.post("/sign_up",(req,res)=>{
    var name=req.body.name;
    var password = req.body.password;
    
    var data={
        "name":name,
        "password":password
    }
    db.collection('login').insertOne(data,(err,collection)=>{
       
        if(err){
            throw err;
        }
        console.log("Record Inserted successfully");
    })
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('home', { items: items });
        }
    });
    
})


app.get('/',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":"*"
    })
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('signup');
        }
    });
}).listen(3000);

console.log("Listening on PORT 3000");