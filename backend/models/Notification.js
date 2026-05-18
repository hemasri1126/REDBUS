const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({

    title:{
        type:String
    },

    message:{
        type:String
    },

    status:{
        type:String,
        default:'unread'
    },

    type:{
        type:String
    },

    language:{
        type:String,
        default:'English'
    },

    deliveryStatus:{
        type:String,
        default:'Delivered'
    },

    retryCount:{
        type:Number,
        default:0
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    'Notification',
    NotificationSchema
);