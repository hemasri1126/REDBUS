const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  userId:{
    type:String,
    required:true
  },

  routeId:{
    type:String,
    required:true
  },

  status:{
    type:String,
    default:'Completed'
  },

  bookedAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  'Booking',
  bookingSchema
);