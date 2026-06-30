const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({

  title:String,

  message:String,

  type:String,

  status:String,

  language:String,

 deliveryStatus:{
    type:String,
    default:'Pending'
},

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  'Notification',
  NotificationSchema
);