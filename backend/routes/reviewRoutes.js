const express = require('express');
const router = express.Router();

const Booking =
require('../models/Booking');

const Review =
require('../models/review.model');

/* CREATE TEST BOOKING */

router.get(
'/create-test-booking',
async(req,res)=>{

  try{

    const booking =
    new Booking({

      userId:'USER001',

      routeId:
      'Hyderabad-Bangalore',

      status:'Completed'

    });

    await booking.save();

    res.json({

      message:
      'Booking Created'

    });

  }

  catch(err){

    console.log(err);

    res.status(500).json(err);

  }

});

/* ADD REVIEW */

router.post('/add', async(req,res)=>{

  const journeyCompleted =
  await Booking.findOne({

    userId:req.body.userId,

    routeId:req.body.routeId,

    status:'Completed'

  });

  if(!journeyCompleted){

    return res.status(400).json({

      message:
      'Journey must be completed before reviewing'

    });

  }

  if(req.body.review.length < 20){

    return res.status(400).json({

      message:
      'Review must contain at least 20 characters'

    });

  }

  const existingReview =
  await Review.findOne({

    userId:req.body.userId,

    journeyId:req.body.journeyId

  });

  if(existingReview){

    return res.status(400).json({

      message:
      'You already reviewed this journey'

    });

  }

  const review =
  new Review(req.body);

  await review.save();

  res.json({

    message:'Review Added'

  });

});

/* GET REVIEWS */

router.get('/:routeId',
async(req,res)=>{

  const reviews =
  await Review.find({

    routeId:req.params.routeId,
    hidden:false

  });

  res.json(reviews);

});

/* EDIT REVIEW */

router.put('/:id', async(req,res)=>{

  const review =
  await Review.findById(req.params.id);

  if(!review){

    return res.status(404).json({

      message:'Review not found'

    });

  }

  const now = new Date();

  const reviewTime =
  new Date(review.createdAt);

  const diffHours =
  (now - reviewTime) /
  (1000 * 60 * 60);

  if(diffHours > 24){

    return res.status(400).json({

      message:
      'Review can only be edited within 24 hours'

    });

  }

  review.review =
  req.body.review;

  await review.save();

  res.json(review);

});

/* REPORT REVIEW */

router.put('/report/:id',
async(req,res)=>{

  const review =
  await Review.findById(req.params.id);

  if(!review){

    return res.status(404).json({

      message:'Review not found'

    });

  }

  review.reportCount++;

  if(review.reportCount >= 3){

    review.hidden = true;

  }

  await review.save();

  res.json(review);

});

/* UPVOTE REVIEW */

router.put('/upvote/:id',
async(req,res)=>{

  const review =
  await Review.findById(req.params.id);

  if(!review){

    return res.status(404).json({

      message:'Review not found'

    });

  }

  review.upvotes++;

  if(review.upvotes >= 5){

    review.trustedReviewer = true;

  }

  await review.save();

  res.json(review);

});

/* DELETE REVIEW */

router.delete('/:id',
async(req,res)=>{

  await Review.findByIdAndDelete(
    req.params.id
  );

  res.json({

    message:
    'Review deleted'

  });

});

module.exports = router;