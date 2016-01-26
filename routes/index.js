var express = require('express');
var router = express.Router();
var request =require('request');
var cheerio = require('cheerio');
var async = require('async');

var main_url='http://racing.hkjc.com/racing/Info/meeting/RaceCard/chinese/Local/20151223';
var draw_url='http://racing.hkjc.com/racing/Info/meeting/Draw/chinese/Local/20151223';
var veterinary_url='http://racing.hkjc.com/racing/Info/meeting/VeterinaryRecord/chinese/Local/20151223';
var trainer_url = 'http://racing.hkjc.com/racing/Info/trainer/Ranking/chinese';
var jockey_url = 'http://racing.hkjc.com/racing/Info/jockey/Ranking/chinese'

/* GET home page. */

/* 1st decide which race is it */
router.get('/fetchRace', function(req, res) {

    var raceList=[];

     request(main_url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
 
        
        
        
        $ = cheerio.load(body);



 var tdS = $('.raceNum').find('td');
 var racePlace = tdS.filter('.racingTitle');


tdS.each(function() {

	if($(this).attr('width')=="24px")
    	{
    		var race =  {};
           
    		race.link = $(this).children().attr('href');
             
             if(!race.link)race.link=main_url;
            //var str = race.link.toString();
            
           race.date = str.split("/");
    		raceList.push(race);
    	}
});

  res.json({race:raceList});


    }



});   


    
    
    
    
    
    
    
    
    
});


/* 2nd fetch horses , veterinary records , draws ,etc from a certain race */
router.get('/', function(req, res) {
   
    var url = req.body.url || main_url;
    var raceID = 0 ;
    var horseList =[];
     var drawList = [];
     var veterinaryList = [];
     var trainerList = [];
     var jockeyList = [];


   
   
    async.parallel([
        function(callback){
         console.log('Fetching Horse ');
         request(url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
 
        
        
        
        $ = cheerio.load(body);

 var trS = $('.draggable').children('tr');
 
	 trS.each(function(index ) {
	 	if(index!=0){
	 		var horse = {};
	 		var tdS = $(this).children();
	 		horse.no = tdS.eq(0).text();
	 		//horse.last6run = tdS.eq(1).text();
	 		//horse.colour = tdS.eq(2).text();
	 		horse.horse = tdS.eq(3).text().split("\r\n")[1].trim();
	 		horse.weight = parseInt(tdS.eq(5).text());
	 		horse.jockey = tdS.eq(6).children().text().split("(")[0];
	 		horse.draw = tdS.eq(8).text();
	 		horse.trainer = tdS.eq(9).children().text();
	 		horse.RTG = parseInt(tdS.eq(10).text());
	 		horse.horse_weight = parseInt(tdS.eq(12).text());

	 		horseList.push(horse);
	 	}
	 	
		
	});

           // res.json(horseList)
    console.log('Done Fetching Horse ');
    callback(null,1)   

    }



}); 
    } ,
        function(callback){
         console.log('Fetching Draw');
         request(draw_url, function (error, response, body) {

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



});} ,
        function(callback){
         console.log('Fetching Veterinary Record');
         request(veterinary_url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);



        var trS = $('.tableBorder0').find('tr');
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
	 	}
	 	
		
	});

          // veterinaryList.splice(0,1)

             console.log('Done Fetching Veterinary Record');
                callback(null,3)

       

    }



});} ,
        function(callback){
         console.log('Fetching Trainer');
         request(trainer_url, function (error, response, body) {

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
	 		trainer.score =Math.round((champion+second+third)/3*100)/100;

            

               

	 		trainerList.push(trainer);
	 	
	 	
		
	});

            //drawList.splice(drawList.length-1,1)

             console.log('Done Fetching Trainer ');
                callback(null,4)

       

    }



});} ,
         function(callback){
         console.log('Fetching Jockey');
         request(jockey_url, function (error, response, body) {

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
	 		jockey.score =Math.round((champion+second+third)/3*100)/100;

            

               

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
            var horse_weight = hr.horse_weight / 1100*100*0.1;
            var weight = 100/hr.weight*100*0.1;
            var draw_placed = hr.draw_placed*5*0.2;
            var RTG = hr.RTG*0.05;
            var veterinary = hr.veterinary*10*0.3;
            var jockey_score = hr.jockey_score*0.25;
            var trainer_score = hr.trainer_score*2*0.2;
            hr.grade =Math.round((horse_weight + weight + draw_placed + RTG - veterinary + jockey_score + trainer_score)*100)/100;
            
        }
        
        //rank
        rankHorse(horseList);
        
        
        res.render('home',{message:'a test',hl:horseList})

    
    
    
    
    
    
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

router.post('/fetchDraw/:raceID',function(req,res){
   
      
      
    
});


router.post('/fetchVeterinary/')
/* 3th analize trainer & jocky */





module.exports = router;
