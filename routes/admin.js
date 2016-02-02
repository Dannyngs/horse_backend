var express = require('express');
var router = express.Router();

/* GET users listing. */





router.get('/api/users',function(req,res,next){
    
    db.users.find().toArray(function(err,users){
        
        if(err)return res.status(500).json(err);
        
        
        
        
        
        res.json(users);
    })
    
})


router.delete('/api/users/:id',function(req,res,next){
    
    db.users.remove({_id: ObjectId(req.params.id)},function(err){
        
        if(err)return res.status(500).json(err);
        
        res.send("Done!");
    })
    
})


router.post('/api/users',function(req,res,next){
   
    var user=req.body
    user.registeredOn=new Date()
    db.users.insert(req.body,function(err){
        
        if(err)return res.status(500).json(err);
        
        res.send("Done!");
    })
    
})

router.put('/api/users/:id',function(req,res,next){
   
    db.users.update({_id:ObjectId(req.params.id)},{$set:{password:req.body.password,salePrice:req.body.salePrice,note:req.body.note}},function(err){
        
        if(err)return res.status(500).json(err);
        
        res.send("Done!");
    })
    
})


router.get('/api/onlineusers',function(req,res,next){
    
    db.current_users.find().toArray(function(err,users){
        
        if(err)return res.status(500).json(err);
        
        res.json(users);
    })
    
})

router.delete('/api/onlineusers/:id',function(req,res,next){
    
    console.log(req.params.id);
    db.current_users.remove({_id: ObjectId(req.params.id)},function(err){
        
        if(err)return res.status(500).json(err);
        
        res.send("Done!");
    })
    
})

router.get('/api/multiplelogin',function(req,res,next){
    
    db.multiplelogin.find().sort( { username: 1 } ).toArray(function(err,logins){
        
        if(err)return res.status(500).json(err);
        
        res.json(logins);
        
    })
    
})

router.delete('/api/multiplelogin',function(req,res,next){
    
    db.multiplelogin.remove({},function(err){
        
         res.status(200).send("Done!");
    })
    if(err)return res.status(500).json(err);
        
       
})



module.exports = router;
