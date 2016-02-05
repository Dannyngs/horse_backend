var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken'); 
ObjectId = require('mongoskin').ObjectID

/* GET users listing. */


router.post('/login',function(req, res) {
    console.log(req.body.id+req.body.password)
    if(req.body.id=='wsh'&&req.body.password=='wsh')
     {
           var token = jwt.sign(req.body.id,'iamdanny', {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        return res.json({rs:'login ok',token:token});

        
    }
    
    return res.status(401).json({rs:'fail to login '});
    
    
    
  });





router.get('/api/users',isAdminAuthed,function(req,res,next){
    
    db.users.find().toArray(function(err,users){
        
        if(err)return res.status(500).json(err);
        
        
        
        
        
        res.json(users);
    })
    
})


router.delete('/api/users/:id',isAdminAuthed,function(req,res,next){
    
    db.users.remove({_id: ObjectId(req.params.id)},function(err){
        
        if(err)return res.status(500).json(err);
        
         db.users.find().toArray(function(err,users){
        
             if(err)return res.status(500).json(err);
        
        
               res.json(users);
          })
    })
    
})


router.post('/api/users',isAdminAuthed,function(req,res,next){
   
    var user=req.body
    user.registeredOn=new Date()
    db.users.insert(req.body,function(err){
        
        if(err)return res.status(500).json(err);
        
          db.users.find().toArray(function(err,users){
        
             if(err)return res.status(500).json(err);
        
        
               res.json(users);
          })
        









    })
    
})

router.put('/api/users/:id',isAdminAuthed,function(req,res,next){
   
    db.users.update({_id:ObjectId(req.params.id)},{$set:{password:req.body.password,salePrice:req.body.salePrice,note:req.body.note}},function(err){
        
        if(err)return res.status(500).json(err);
        
         db.users.find().toArray(function(err,users){
        
             if(err)return res.status(500).json(err);
        
        
               res.json(users);
          })
    })
    
})


router.get('/api/onlineusers',isAdminAuthed,function(req,res,next){
    
    db.current_users.find().toArray(function(err,users){
        
        if(err)return res.status(500).json(err);
        
        res.json(users);
    })
    
})

router.delete('/api/onlineusers/:id',isAdminAuthed,function(req,res,next){
    
    console.log(req.params.id);
    db.current_users.remove({_id: ObjectId(req.params.id)},function(err){
        
        if(err)return res.status(500).json(err);
        
        res.send("Done!");
    })
    
})

router.get('/api/multiplelogin',isAdminAuthed,function(req,res,next){
    
    db.multiplelogin.find().sort( { username: 1 } ).toArray(function(err,logins){
        
        if(err)return res.status(500).json(err);
        
        res.json(logins);
        
    })
    
})

router.delete('/api/multiplelogin',isAdminAuthed,function(req,res,next){
    
    db.multiplelogin.remove({},function(err){
        
         res.status(200).send("Done!");
    })
    if(err)return res.status(500).json(err);
        
       
})


function isAdminAuthed(req,res,next){
    
      // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token,'iamdanny', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
       
          next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(401).json({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}
module.exports = router;
