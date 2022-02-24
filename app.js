//jshint esversion:6
require("dotenv").config();
//console.log(process.env.API_KEY);
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  username:String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]});


const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
})

app.get("/login",function(req,res){
res.render("login");
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username:username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(password === found.password){
          res.render("secrets");
        }
      }
    }
  })
})


app.listen(3000,function(){
  console.log("Server is in the air!!!");
});
