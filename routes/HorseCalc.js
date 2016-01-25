





  
    




function fetchMain(){

      async.series([
        function(){
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
  

       

    }



}); 
    } ,
        function(){
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

            res.json(drawList)
            
  

       

    }



});}
        ], function(error, results) {
  console.log('done');
});
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
    		raceList.push(race);
    	}
});

//#get horses
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


  

        console.log(raceList.length)
        console.log(horseList.length)
         //res.render('index', {body:'asasdasd'});

    }

         // res.render('index', { body: error});


}); 
}


function fetchDraw(raceID){
    
    
    request(draw_url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
 
        
        
        
        $ = cheerio.load(body);



 var trS = $('.rowDiv30').eq(raceID).find('.trBdddgWhite');
 
        trS.each(function(index ) {
            
	 		var draw = {};
	 		var tdS = $(this).children();
	 		draw.no = tdS.eq(0).text();
	 		draw.placed = tdS.eq(8).text();
             

               

	 		drawList.push(draw);
	 	
	 	
		
	});

            drawList.splice(drawList.length-1,1)

             console.log(drawList.length);
            
  

       

    }



});
    
    
}

function fetchVeterinary(){}

function fetchJockey(){}

function fetchTraners(){}












module.exports.fetchMain = fetchMain;
module.exports.fetchRace = fetchRace;

module.exports.fetchDraw = fetchDraw;