const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({

  start:String,

  destination:String,

  distance:String,

  travelTime:String,

  trafficStatus:String,

  delayMessage:String

});

module.exports =
mongoose.model(
  'Route',
  routeSchema
);