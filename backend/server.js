const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Post = require('./models/Post');
const Notification = require('./models/Notification');

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* MONGODB CONNECTION */

mongoose.connect(
    'mongodb+srv://tedbus:tedbus123@tedbus.1lx0yza.mongodb.net/?retryWrites=true&w=majority&appName=tedbus'
)
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

/* CREATE NOTIFICATION API */

app.post('/notifications',async(req,res)=>{

    try{

        const notification = new Notification(req.body);

        await notification.save();

        res.status(200).json(notification);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* GET NOTIFICATIONS API */

app.get('/notifications',async(req,res)=>{

    try{

        const notifications = await Notification.find();

        res.status(200).json(notifications);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* UPDATE NOTIFICATION API */

app.put('/notifications/:id',async(req,res)=>{

    try{

        const updatedNotification =
        await Notification.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        res.status(200).json(updatedNotification);

    }
    catch(error){

        res.status(500).json(error);

    }

});

/* SERVER */

app.listen(5000,()=>{

    console.log("Server running on port 5000");

});

/* DELETE NOTIFICATION API */

app.delete('/notifications/:id',async(req,res)=>{

    try{

        await Notification.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json(
            "Notification Deleted"
        );

    }
    catch(error){

        res.status(500).json(error);

    }

});