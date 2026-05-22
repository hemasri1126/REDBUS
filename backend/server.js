const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require('socket.io');

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

/* EMAIL TRANSPORTER */

const transporter = nodemailer.createTransport({

    service:'gmail',

    auth:{

        user:'hemashri1126@gmail.com',

        pass:'nxlutttwtpdjdbxy'

    }

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

        console.log(error);

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

        console.log("Notification API called");

        const notification = new Notification(req.body);

        await notification.save();

        /* SOCKET EVENT */

        io.emit('newNotification',notification);

        /* SEND EMAIL */

        const info = await transporter.sendMail({

            from:'hemashri1126@gmail.com',

            to:'hemashri1126@gmail.com',

            subject:notification.title,

            html: `
            
            <div style="font-family:Arial;padding:20px;">

                <h2 style="color:#d84e55;">
                    ${notification.title}
                </h2>

                <p style="font-size:16px;">
                    ${notification.message}
                </p>

                <hr>

                <p>
                    Thank you for choosing TedBus.
                </p>

            </div>

            `

        });

        console.log(info);

        res.status(200).json(notification);

    }
    catch(error){

        console.log(error);

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

/* SOCKET.IO SERVER */

const server = http.createServer(app);

const io = new Server(server,{

    cors:{

        origin:'http://localhost:4200',

        methods:['GET','POST']

    }

});

io.on('connection',(socket)=>{

    console.log('User Connected');

});

/* SERVER */

server.listen(5000,()=>{

    console.log("Server running on port 5000");

});
const routeRoutes =
require('./routes/routeRoutes');

app.use('/routes',routeRoutes);