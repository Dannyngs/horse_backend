var express = require('express');
var router = express.Router();
var request =require('request');
var cheerio = require('cheerio');
var async = require('async');



var EXPIRETIME =   360

var main_url='http://racing.hkjc.com/racing/Info/meeting/RaceCard/english';
var horse_url='http://racing.hkjc.com/racing/Info/meeting/RaceCard/';

var draw_url='http://racing.hkjc.com/racing/Info/meeting/Draw/';
var veterinary_url='http://racing.hkjc.com/racing/Info/meeting/VeterinaryRecord/';
var trainer_url = 'http://racing.hkjc.com/racing/Info/trainer/Ranking/';
var jockey_url = 'http://racing.hkjc.com/racing/Info/jockey/Ranking/';

/* GET home page. */

/* 1st decide which race is it */
router.get('/fetchRace', function(req, res) {

    var raceList=[];

     request(main_url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
 
        
        
        
        $ = cheerio.load(body);



 var tdS = $('.raceNum').find('td');
 var racePlace = tdS.filter('.racingTitle');


tdS.each(function(index) {

	if($(this).attr('width')=="24px")
    	{
    		var race =  {};
           
    		
           
             if(!$(this).children().attr('href'))
                 {
                  race.no= 1 ;
                 race.link='/';//need to edit hen production
               }
               else 
               {
                   race_str = $(this).children().attr('href').split('Local/')
                   race.link =race_str[1];
                   race.no = index-1;

                   
               }
            //var str = race.link.toString();
            
          // race.date = str.split("/");
    		raceList.push(race);
    	}
});

  res.json(raceList);


    }



});   


    
    
    
    
    
    
    
    
    
});


/* 2nd fetch horses , veterinary records , draws ,etc from a certain race */
router.post('/', function(req, res) {
   
    var link =  req.body.link;
    var     lang = req.body.lang||'english';
    var raceID = 0;
    if(link!="/")//need to edit hen production
     raceID = link.split('/')[2]-1;
    console.log(raceID)
    var horseList =[];
     var drawList = [];
     var veterinaryList = [];
     var trainerList = [];
     var jockeyList = [];
        var raceinfo={};

   
   
    async.parallel([
        function(callback){
         console.log('Fetching Horse');



         request(horse_url+lang+'/Local/'+link, function (error, response, body) {

    if (!error && response.statusCode == 200) {
 
        
        
        
        $ = cheerio.load(body);

 var trS = $('.draggable').children('tr');
   raceinfoArray= $('.divWidth400').find('td').text().split(",");
    raceinfo=raceinfoArray[0]+raceinfoArray[1]+' , '+raceinfoArray[2]
	 trS.each(function(index ) {
	 	if(index!=0){
	 		var horse = {};
	 		var tdS = $(this).children();

	 		horse.no = parseInt(tdS.eq(0).text());	
	 		horse.horse = tdS.eq(3).text().split("\r\n")[1].trim();
	 		horse.weight = parseInt(tdS.eq(5).text());
	 		horse.jockey = tdS.eq(6).children().text().split("(")[0];
           
	 		horse.draw = parseInt(tdS.eq(8).text())||0;
	 		horse.trainer = tdS.eq(9).children().text();
	 		horse.rtg = parseInt(tdS.eq(10).text());
	 		horse.horse_weight = parseInt(tdS.eq(12).text())||0;
            
            if(horse.draw &&horse.horse_weight)
	 		horseList.push(horse);
	 	}
	 	
		
	});

           // res.json(horseList)
    console.log('Done Fetching Horse ');
    callback(null,1)   

    }



}); 
    } ,//Fetch Horse Basic Info
        function(callback){
         console.log('Fetching Draw');
         request(draw_url+lang+'/Local/', function (error, response, body) {

    if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);



 var trS = $('.rowDiv30').eq(raceID).find('.trBgWhite');
        trS.each(function(index ) {
            
	 		var draw = {};
	 		var tdS = $(this).children();
	 		draw.no = tdS.eq(0).text();
	 		draw.placed = parseInt(tdS.eq(8).text());
            

               

	 		drawList.push(draw);
	 	
	 	
		
	});

            drawList.splice(drawList.length-1,1)

             console.log('Done Fetching Draw ');
                callback(null,2)

       

    }



});} ,//Fetch Drawy Info
        function(callback){
         console.log('Fetching Veterinary Record');
         request(veterinary_url+lang+'/Local/'+link, function (error, response, body) {

    if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);



       var trS = $('.tableBorder0').first().find('tr');
        
      
        var cur_no = 0 ;
        trS.each(function(index ) {
         
            if(index>0){
	 		var veter = {};
            
	 		var tdS = $(this).children();
            var hno = parseInt(tdS.eq(0).text());
            if(hno)
            {
                veter.horse_no = hno;
                cur_no = hno;
            }
        else{
                veter.horse_no = cur_no ;    

            }


	 		veterinaryList.push(veter);
            console.log(veter.horse_no)
	 	}
	 	
		
	});

          // veterinaryList.splice(0,1)
             console.log('Done Fetching Veterinary Record');
                callback(null,3)

       

    }



});} ,//Fetch Veterinary Info
        function(callback){
         console.log('Fetching Trainer');
         request(trainer_url+lang, function (error, response, body) {

    if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);



    var trS = $('.number');
        trS.each(function(index ) {
            
	 		var trainer = {};
	 		var tdS = $(this).children();
	 		trainer.name = tdS.eq(0).text();
            var champion = parseInt(tdS.eq(1).text());
            var second = parseInt(tdS.eq(2).text());
            var third = parseInt(tdS.eq(3).text())
	 		trainer.score =Math.round((champion+second+third)*100)/100;

            

               

	 		trainerList.push(trainer);
	 	
	 	
		
	});


             console.log('Done Fetching Trainer ');
                callback(null,4)

       

    }



});} ,
         function(callback){
         console.log('Fetching Jockey');
         request(jockey_url+lang, function (error, response, body) {

    if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);



    var trS = $('.number');
        trS.each(function(index ) {
            
	 		var jockey = {};
	 		var tdS = $(this).children();
	 		jockey.name = tdS.eq(0).text();
            var champion = parseInt(tdS.eq(1).text());
            var second = parseInt(tdS.eq(2).text());
            var third = parseInt(tdS.eq(3).text())
	 		jockey.score =Math.round((champion+second+third)*100)/100;

            

               

	 		jockeyList.push(jockey);
	 	
	 	
		
	});

            //drawList.splice(drawList.length-1,1)

             console.log('Done Fetching Jockey ');
                callback(null,5)

       

    }



});} 
        ], function(error, results) {
        console.log('Done All Fetchig');
       
        //assign placed to each horse
        for(var i=0;i<horseList.length;i++){
            
            for(var j=0;j<drawList.length;j++){
            
                if(horseList[i].draw==drawList[j].no)
                    horseList[i].draw_placed=drawList[j].placed;
            }
            
        }
        //assign veterinary to each horse
         for(var i=0;i<horseList.length;i++){
            horseList[i].veterinary = 0;
            for(var j=0;j<veterinaryList.length;j++){
            
                if(horseList[i].no==veterinaryList[j].horse_no)
                    horseList[i].veterinary++;
            }
            
        }
        //assign trainer score to each horse
          for(var i=0;i<horseList.length;i++){
            for(var j=0;j<trainerList.length;j++){
            
                if(horseList[i].trainer==trainerList[j].name)
                    horseList[i].trainer_score=trainerList[j].score;
            }
            
        }
       //assign jockey score to each horse
          for(var i=0;i<horseList.length;i++){
            for(var j=0;j<jockeyList.length;j++){
            
                if(horseList[i].jockey==jockeyList[j].name)
                    horseList[i].jockey_score=jockeyList[j].score;
            }
            
        }
        
        // calculate
        
        for(var i=0;i<horseList.length;i++){
            var hr = horseList[i];
            hr.HORSE_WEIGHT = 1000/hr.horse_weight* 100*0.1;
            hr.WEIGHT = 110/hr.weight*100*0.1;
            hr.DRAW_PLACED = hr.draw_placed*0.2;
            hr.RTG = hr.rtg*0.05;
            
            hr.VETERINARY = hr.veterinary*10*0.1;
            hr.JOCKEY_SCORE = hr.jockey_score*0.25;
            hr.TRAINER_SCORE = hr.trainer_score*2*0.2;
            hr.grade =Math.round((hr.HORSE_WEIGHT + hr.WEIGHT + hr.DRAW_PLACED +  hr.RTG - hr.VETERINARY + hr.JOCKEY_SCORE + hr.TRAINER_SCORE)*100)/100;
             
        }
        
        //rank
        rankHorse(horseList);
        
      
       
       res.json({hl:horseList,ri:raceinfo})
    
    
    
    
    
    
    });
    




});



 function rankHorse(array) {
     
    var i = 0, len = array.length,j, d;
     
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (array[i].grade > array[j].grade) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
}


/* socket.io setting */
   
   io.on('connection', function(socket){
       var ip=socket.request.connection.remoteAddress;
       var socid=socket.id;
      
       
       console.log(socid+': Visiter Showed')
     
       socket.on('login', function(user){
          console.log(socid+': Trying to login  : '+user.username);
           
          //Step 1 : check with databases
       var username=user.username;
        var password=user.password;
    
    db.users.findOne({username:username,password:password},function(err,user){
           
           if(err) return socket.emit('loginfailed',{msg:err});
           if(!user)return socket.emit('loginfailed',{msg:"Incorrect login infomation"});
            if(user.role!='admin'){
               
            //Step 2 : check if loged in 
            
            db.current_users.findOne({userkey:user.username},function(err,keylog){
                if(err) return socket.emit('loginfailed',{msg:err});
                             

                if(keylog)//if there's multiple login
                {               

                    db.multiplelogin.insert(
                        {ip:ip,username:user.username,date:new Date()},
                        function(err){});
                    console.log(socid+': Mutilple Login Occured: '+user.username)
                    return socket.emit('loginfailed',{msg:"This account is currently being used"}); 
                
                }
                
                //Step 3 : passed!
                var expireTime = new Date();
                expireTime.setMinutes(expireTime.getMinutes() + EXPIRETIME);
                db.current_users.insert({userkey:user.username,expireAt:expireTime,date:new Date(),socid:socid},function(err){
                if(err)console.log(err);
                 //iouser=user;
                    console.log(socid+': User loged in : '+user.username)
                    socket.emit('loginok',user)
                      
                })              
            
            
            })
           
            
           }else{
                return  socket.emit('loginok',user)
            }
            
            
            
       })
    
     
          
      
      
     
      
      
      
     
  }); //end of socket login    
       
       socket.on('logout',function(sid){
           
           db.current_users.remove({socid:socid},function(err){
            if(err)return socket.emit('logoutfailed',err);
         console.log(socid+': user logout ')
          return socket.emit("logoutok",'log out ok!');
           
       }) 
       })
       
       socket.on('disconnect', function(){

      
       db.current_users.remove({socid:socid},function(err,rs){
           if(err)console.log(err);
           
              if(!rs.result.n)
               return console.log(socid+': Visiter left ');
           console.log(socid+': User left ');
           
           
       }) 
       
  });
   
   });  
    
    



module.exports = router;
