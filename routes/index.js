var express = require('express');
var router = express.Router();
var request =require('request');
var cheerio = require('cheerio');
var async = require('async');

var main_url='http://racing.hkjc.com/racing/Info/meeting/RaceCard/chinese/Local/20151223';
var draw_url='http://racing.hkjc.com/racing/Info/meeting/Draw/chinese/Local/20151223';
var veterinary_url='http://racing.hkjc.com/racing/Info/meeting/VeterinaryRecord/chinese/Local/';

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
router.post('/fetchHorse', function(req, res) {
   
    var url = req.body.url || main_url;
    var raceID = 0 ;
    var horseList =[];
     var drawList = [];

   
   
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
	 		horse.last6run = tdS.eq(1).text();
	 		horse.colour = tdS.eq(2).text();
	 		horse.horse = tdS.eq(3).text();
	 		horse.weight = tdS.eq(5).text();
	 		horse.jockey = tdS.eq(6).children().text();
	 		horse.draw = tdS.eq(8).text();
	 		horse.trainer = tdS.eq(9).children().text();

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
	 		draw.placed = tdS.eq(8).text();
            

               

	 		drawList.push(draw);
	 	
	 	
		
	});

            drawList.splice(drawList.length-1,1)

             console.log('Done Fetching Draw ');
                callback(null,2)

       

    }



});}
        ], function(error, results) {
        console.log('Done All Fetchig');
       
        //assign placed to each horse
        for(var i=0;i<horseList.length;i++){
            
            for(var j=0;j<drawList.length;j++){
            
                if(horseList[i].draw==drawList[j].no)
                    horseList[i].placed=drawList[j].placed;
            }
            
        }
        //assign veterinary to each horse
        res.json(horseList)

    
    
    
    
    
    
    });
    




});





router.post('/fetchDraw/:raceID',function(req,res){
   
      
      
    
});


router.post('/fetchVeterinary/')
/* 3th analize trainer & jocky */





module.exports = router;
