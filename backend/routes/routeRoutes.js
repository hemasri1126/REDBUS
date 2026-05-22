const express = require('express');

const router = express.Router();

const Route =
require('../models/Route');

/* SAVE ROUTE */

router.post('/save',async(req,res)=>{

  const route =
  new Route(req.body);

  await route.save();

  res.json(route);

});

/* GET ROUTES */

router.get('/',async(req,res)=>{
router.delete('/:id',async(req,res)=>{

  try{

    await Route.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message:'Route Deleted'

    });

  }

  catch(error){

    res.status(500).json({

      message:error.message

    });

  }

});
  const routes =
  await Route.find();

  res.json(routes);

});

module.exports = router;
/* DELETE ROUTE */

router.delete('/:id',async(req,res)=>{

  try{

    await Route.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message:'Route Deleted'

    });

  }

  catch(error){

    res.status(500).json({

      message:error.message

    });

  }

});