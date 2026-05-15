const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Post = require('./models/Post');

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* MONGODB CONNECTION */

mongoose.connect('mongodb+srv://tedbus:tedbus123@tedbus.1lx0yza.mongodb.net/?retryWrites=true&w=majority&appName=tedbus')
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log(err);
});

/* TEST API */

app.get('/',(req,res)=>{

    res.send("Server Running");

});

/* CREATE POST API */

app.post('/posts',async(req,res)=>{

    try{

        const post = new Post(req.body);

        await post.save();

        res.status(200).json(post);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* GET POSTS API */

app.get('/posts',async(req,res)=>{

    try{

        const posts = await Post.find();

        res.status(200).json(posts);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* DELETE POST API */

app.delete('/posts/:id',async(req,res)=>{

    try{

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json("Post Deleted");

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* UPDATE POST API */

app.put('/posts/:id',async(req,res)=>{

    try{

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        res.status(200).json(updatedPost);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* SERVER */

app.listen(5000,()=>{

    console.log("Server running on port 5000");

});