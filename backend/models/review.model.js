const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  routeId:{
    type:String,
    required:true
  },

  userId:{
    type:String,
    required:true
  },

  journeyId:{
    type:String,
    required:true
  },

  userName:{
    type:String
  },

  rating:{
    type:Number,
    min:1,
    max:5
  },

  review:{
    type:String,
    required:true
  },

  verified:{
    type:Boolean,
    default:true
  },

  reportCount:{
    type:Number,
    default:0
  },

  hidden:{
    type:Boolean,
    default:false
  },

  createdAt:{
    type:Date,
    default:Date.now
  },
upvotes:{
  type:Number,
  default:0
},

trustedReviewer:{
  type:Boolean,
  default:false
}
});

module.exports =
mongoose.model(
  'Review',
  reviewSchema
);
