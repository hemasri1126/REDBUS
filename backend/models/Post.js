const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    title:{
        type:String
    },

    description:{
        type:String
    },

    route:{
        type:String
    },

    hashtags:{
        type:String
    },

    image:{
        type:String
    },

    likes:{
        type:Number,
        default:0
    },

    comments:{
        type:Array,
        default:[]
    },

    reported:{
        type:Boolean,
        default:false
    },

    saved:{
        type:Boolean,
        default:false
    },

    following:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('Post',PostSchema);