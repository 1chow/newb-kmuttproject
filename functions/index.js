//Cloud Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const query = require('./query');


admin.initializeApp(functions.config().firebase);
//query.initializeApp(functions.config().firebase);


const db = admin.database();
const timeStart = new Date().getTime();
const timeEnd = new Date().getTime() + (30 * 60 * 1000);

// mockup Service 

exports.addMockup = functions.https.onRequest((req, res) => {

	for (var i = 0; i <= 10; i++) {

		db.ref('/item').push({
			  	name:"Lorem ipsum dolor sit amet",
			  	isActive: 1,
			  	desc:{
				  	short:"Consectetur adipisicing elit. Est sed.",
				  	fullHeader:"Consectetur adipisicing elit. Est sed.",
				  	fullDesc :'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
			  	},
			  	bid:{
			  		startTime: timeStart,
			  		endTime: timeEnd,
			  		stepBid: 5,
			  		openBid: 30
			  	},
			  	img:"'a','b','c'"
			})
		.then(snapshot => {
				db.ref('/item/' + snapshot.key + '/bidList').push({
					userId : null,
					bid : 30,
					bidTimestamp : timeStart
			});
			res.status(200).end();
	  	});

	}

});


exports.resetMockup = functions.https.onRequest((req, res) => {

	db.ref('/item').once("value" ,function(snapshot) {
	    snapshot.forEach(function(childSnapshot) {
	    	db.ref('/item/'+ childSnapshot.key ).update({
		    	bid:{
			  		start: timeStart,
			  		end: timeEnd,
			  		step:"30"
			  	}
	    	})
	    	db.ref('/item/' + childSnapshot.key + '/bidList').remove();
	    	db.ref('/item/' + childSnapshot.key + '/bidList').push({
				userId : null,
				bid : 30,
				bidTimestamp : timeStart
			});
	  	});
		res.status(200).end();
	});

});


exports.getMockup = functions.https.onRequest((req, res) => {

  res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
  res.set('Access-Control-Allow-Origin', '*');

 	 db.ref('/item').once("value", function(snapshot) {
 	 	//JSON TO array
	  	const arrays = [];
	    snapshot.forEach(function(childSnapshot) {		      
	      var key = childSnapshot.key;
	      var childData = childSnapshot.val();
	      childData['id'] = key;
	      arrays.push(childData);
	  });
  		res.status(200).send(arrays);
	});

});




// mockup Service 
