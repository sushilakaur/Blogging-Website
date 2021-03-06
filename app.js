var express = require("express");
var app=express();
var path = require("path");
var methodOverride = require('method-override')
var bodyParser=require('body-parser');
var expressSanitizer=require("express-sanitizer");

var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blogapp",{useNewUrlParser: true});

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer());
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

var blogsSchema=mongoose.Schema({
    title:String,
    link:String,
    description:String
});

var blog=mongoose.model("blog",blogsSchema);

//Routes
app.get("/blogs",function(req,res){
    blog.find({},function(err,x){
        if(err){
            console.log("There is an error");
        }else{
            res.render("blogs",{blogapp:x});
        }
    })
    
});

//new 
app.get("/blogs/new",function(req,res){
    res.render("newBlog");
})

//create route
app.post("/blogs",function(req,res){
    var head=req.body.head;
    var img=req.body.img;
    var desc=req.body.desc;
    var blogNew={title:head,link:img,description:desc}
    blog.create(blogNew,function(){
        res.redirect("/blogs")
    });
})

//show route
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,found){
        if(err){
            console.log("Something went wrong")
        }
        else{
            res.render("show",{found:found});
        }
    })
})

//edit route
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,editBlog){
        if(err){
            console.log("Something is Wrong");
        }else{
            res.render("edit",{blog:editBlog})
        }
    })
})

// update route
app.put("/blogs/:id",function(req,res){
    console.log(req.body.blog)
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundAndUpdated){
        if(err){
            console.log("Something is wrong in Put")
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

// destroy route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err,foundAndDeleted){
        if(err){
            console.log("something is wrong in delete")
        }else{
            res.redirect("/blogs");
        }
    })
    // console.log("Deleteroute");
})

app.listen(3000,function(){
    console.log("Server Started");
})