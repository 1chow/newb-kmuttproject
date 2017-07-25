//Cloud Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const query = require('./query');


admin.initializeApp(functions.config().firebase);
//query.initializeApp(functions.config().firebase);


const db = admin.database();

const timeCurrent = admin.database.ServerValue.TIMESTAMP 


////// mockup Service //////

	//https://us-central1-auctkmutt.cloudfunctions.net/addMockups >> add Item & catagories
	exports.addMockups = functions.https.onRequest((req, res) => {

		const nameCat = ['House Hold','Electric Gadget','Jewery & Beautyware','Activity Product','Food & Beverage']
		const iconCat = ['fa-home','fa-plug','fa-diamond','fa-bicycle','fa-cutlery']

		for (var i = 0; i <= 4; i++) {
			
			db.ref('/catagories').push({
				  	name: nameCat[i],
				  	icon: iconCat[i],

				})				
			.then(snapshot => {
			});

				for (var j = 0; j <= 4; j++) {

					db.ref('/items').push({
						  	name: 'Salty Camel',
						  	catagory: nameCat[i],
						  	isActive: 1,
						  	desc:{
							  	short:'Consectetur adipisicing elit. Est sed.',
							  	fullHeader:'Consectetur adipisicing elit. Est sed.',
							  	fullDesc :'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
						  	},
						  	bid:{
						  		startTime: timeCurrent,
						  		endTime: timeCurrent,
						  		stepBid: 5,
						  		openBid: 30
						  	},
						  	img:['a', 'b', 'c'],
						  	own : 'jByPD6RZW2UUgTx7M305k2BrSrr2',
						})
					.then(snapshot => {
							db.ref('/items/' + snapshot.key + '/bidList').push({
								userId : '',
								bid : 30,
								bidTimestamp : timeCurrent
						});
				  	});
				};
		};

		res.status(200).send('Add now 16');
	});

	//https://us-central1-auctkmutt.cloudfunctions.net/resetItems
	exports.resetItems = functions.https.onRequest((req, res) => {

		db.ref('/items').once("value" ,function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		    	var time = time +1
		    	db.ref('/items/'+ childSnapshot.key ).update({
			    	bid:{
				  		start: timeCurrent,
				  		end: timeCurrent + (time * 2 * 60 * 1000),
				  		step: 30
				  	}
		    	})
		    	db.ref('/items/' + childSnapshot.key + '/bidList').remove();
		    	db.ref('/items/' + childSnapshot.key + '/bidList').push({
					userId : '',
					bid : 30,
					bidTimestamp : timeCurrent
				});
		  	});
			res.status(200).send('Reset Now !!');
		});
	});

/////// Item Service ///////

	//https://us-central1-auctkmutt.cloudfunctions.net/getItem >> all Items
	//https://us-central1-auctkmutt.cloudfunctions.net/getItems?itemId=XXXXXXX >> specific Items
	exports.getItems = functions.https.onRequest((req, res) => {

	  res.set('Access-Control-Allow-Origin', '*');

	  const itemKey = req.query.itemId;

	  	if(itemKey != null){

		  	db.ref('/items/'+ itemKey ).once('value', function(snapshot) {

		  		 var data = snapshot.val();
		  		 var active = data.isActive;
		  		 var timeEnd = data.bid.endTime;
		  		 
		  		 	db.ref('/items/'+ itemKey ).update({
		  		 		timeNow :  timeCurrent,
		  		 	}).then(childsnapshot => {
		  		 		var tOut = data.timeNow - timeEnd ;
		  		 		if ( tOut <= 0 && active != 0){
			  				db.ref('/items/'+ itemKey ).update({
			  					isActive :  0
			  				})
		  				}
		  		 	});
		  		 
			     const listArrays = [];
				      snapshot.child('bidList').forEach(function(listSnapshot) {
				      	var listKey = listSnapshot.key;
				      	var listData = listSnapshot.val();
				      	listData['_id'] = listKey;
				      	listArrays.push(listData);
				      });
				 data['bidList'] = listArrays;
				 res.status(200).send(data);
			});
		}
		else {

		  	db.ref('/items').once('value', function(snapshot) {
		  		const arrays = [];
			  		snapshot.forEach(function(childSnapshot) {
				      var key_ = childSnapshot.key;
				      var childData = childSnapshot.val();
				      childData['_id'] = key_;

				      const listArrays = [];

				      childSnapshot.child('bidList').forEach(function(listSnapshot) {
				      	var listKey = listSnapshot.key;
				      	var listData = listSnapshot.val();
				      	listData['_id'] = listKey;
				      	listArrays.push(listData);
				      })

					  childData['bidList'] = listArrays;
				      arrays.push(childData);

				      	db.ref('/items').child(key_).update({
			  		 		timeNow :  timeCurrent,
			  		 	})

		  		 		var tOut = childData.timeNow - childData.startTime
		  		 		if ( tOut <= 0 && active != 0){
			  				db.ref('/items/'+ itemKey ).update({
			  					isActive :  0
			  				})
		  				}
				  	});
			   	res.status(200).send(arrays);
			   	res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
			});
	   	}
	});

//// catagories Service ////

	//https://us-central1-auctkmutt.cloudfunctions.net/addMockup
	exports.getCatagories = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
		res.set('Access-Control-Allow-Origin', '*');

	  	db.ref('/catagories').once('value', function(snapshot) {
		    const arrays = [];
			    snapshot.forEach(function(childSnapshot) {
			      	var childKey = childSnapshot.key;
			      	var childData = childSnapshot.val();
			      	childData['_id'] = childKey;
			      	arrays.push(childData);
			    });
			res.status(200).send(arrays);
		});
	});

/////// users Service //////

	//on Create Account
	exports.onCreateAccount = functions.auth.user().onCreate(event => {

		const user = event.data;
		const email_ = (user.email).toLowerCase();

			db.ref('/users/' + user.uid ).update({
				info :{
					email : email_,
					photoUrl : 'default',//create thumbnail
					role : 'member',// member & admin
					address : '',
					tel : ''
				},
				cart :['-Kpg7gBzgMTIfS5IjmO-','-Kpg7gBwbPyzf036qhk'],//itemID 
			})
			.then(snapshot => {
					db.ref('/users/' + user.uid + '/history').push({
						OrderId : '',
						OrderAmount: '',
						OrderCreateDate: timeCurrent,
						OrderTitle: '',
				});
		  	});		
	});

	//https://us-central1-auctkmutt.cloudfunctions.net/getAccount
	//https://us-central1-auctkmutt.cloudfunctions.net/getAccount?userId=xxxxxxxx
	exports.getAccount = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
		res.set('Access-Control-Allow-Origin', '*');

		const userKey = req.query.userId;

	  	if(userKey != null){

			db.ref('/users/'+ userKey ).once('value', function(snapshot) {
		  		 
		  		 var data = snapshot.val();
			     const listArrays = [];

			      snapshot.child('history').forEach(function(listSnapshot) {
			      	var listKey = listSnapshot.key;
			      	var listData = listSnapshot.val();
			      	listData['_id'] = listKey;
			      	listArrays.push(listData);
			      });

				 data['history'] = listArrays;
			     res.status(200).send(data);
			});

		}

		else {

		  	db.ref('/users').once('value', function(snapshot) {
		  		const arrays = [];
			    snapshot.forEach(function(childSnapshot) {
			      	var childKey = childSnapshot.key;
			      	var childData = childSnapshot.val();
			      	childData['_id'] = childKey;

			      	const listArrays = [];

				      childSnapshot.child('history').forEach(function(listSnapshot) {
				      	var listKey = listSnapshot.key;
				      	var listData = listSnapshot.val();
				      	listData['_id'] = listKey;
				      	listArrays.push(listData);
				      });

					childData['history'] = listArrays;
		      		arrays.push(childData);
			    });
			res.status(200).send(arrays);
			});

	   	}
	});

////// Order Service ///////

	//on Create Order
	exports.onCreateOrder = functions.database.ref('/orders/{ordersId}')    
   	 .onCreate( event => {

   	 	const order = event.data.val();
   	 	const eParam = event.params.ordersId;	 	 

		db.ref('/orders/'+ eParam ).update({
			orderCreateDate: timeCurrent,
		});
	});


	//https://us-central1-auctkmutt.cloudfunctions.net/addMockup
	exports.createOrder = functions.https.onRequest((req, res) => {

	  	db.ref('/orders/').push({
	  		orderPrice: 0,// sumPrice
	  		orderCount: 0,// countList
	  		orderOwnerId:'',
	  		orderMethod:{
	  			payment:'',
	  			logistic:''
	  		},
			owner:{
				title: '',
				name: '',
				address: '',
				tel:''
			}
		})
		.then(snapshot => {
			db.ref('/orders/' + snapshot.key + '/orderList').push({
  				itemId:'',
  				price:'',
  				amount:1,
			});
		res.status(200).send('createOrder '+snapshot.key);
		});		
	});


	//https://us-central1-auctkmutt.cloudfunctions.net/getOrder
	//https://us-central1-auctkmutt.cloudfunctions.net/getOrder?userId=xxxxxxxx
	exports.getOrder = functions.https.onRequest((req, res) => {

	  res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
	  res.set('Access-Control-Allow-Origin', '*');

	  const ordersKey = req.query.ordersId;

	  	if(ordersKey != null){

		  	db.ref('/orders/'+ itemKey ).once('value', function(snapshot) {
		  		 var data = snapshot.val();
			     const listArrays = [];
				      snapshot.child('orderList').forEach(function(listSnapshot) {
				      	var listKey = listSnapshot.key;
				      	var listData = listSnapshot.val();
				      	listData['_id'] = listKey;
				      	listArrays.push(listData);
				      });
				 data['orderList'] = listArrays;
				 res.status(200).send(data);
			});
		}
		else {

		  	db.ref('/orders').once('value', function(snapshot) {
		  		const arrays = [];
		  		snapshot.forEach(function(childSnapshot) {
			      var key = childSnapshot.key;
			      var childData = childSnapshot.val();
			      childData['_id'] = key;

			      const listArrays = [];

				      childSnapshot.child('orderList').forEach(function(listSnapshot) {
				      	var listKey = listSnapshot.key;
				      	var listData = listSnapshot.val();
				      	listData['_id'] = listKey;
				      	listArrays.push(listData);
				      })

				  childData['orderList'] = listArrays;
			      arrays.push(childData);
			  	});
			   	res.status(200).send(arrays);
			});
	   	}
	});


////// Bit Service ///////

	//https://us-central1-auctkmutt.cloudfunctions.net/bidOrder?itemId=-KpnlbR3SbEGDnNqzDI7&bid=999&uId=jByPD6RZW2UUgTx7M305k2BrSrr2
	exports.bidOrder = functions.https.onRequest((req, res) => {

		var itemKey = req.query.itemId;
		var newBid 	= req.query.bid;
		var uid	= req.query.uId;

	  	db.ref('/items/' + itemKey ).once('value', function(snapshot) {

			var data = snapshot.val();
			var active = data.isActive;
			var bidEndTime = data.bid.endTime;
			console.log('timeend : ' + bidEndTime )

			//var bidLast = [];

			db.ref('/items/' + itemKey + '/bidList').orderByChild('bid').limitToLast(1).once('value', function(childSnapshot) {
				var bidLast = [];
				childSnapshot.forEach((duckSnap) => {
					const duck = duckSnap.val();
					bidLast.push(duck);
				});

				var mfk = bidLast[0];//bidLastWin

				db.ref('/items/'+ itemKey).update({
	  		 		  timeNow :  timeCurrent,
	  		 		}).then(timeSnapshot => {
	  		 		var tOut_ = bidEndTime - data.timeNow;
	  		 		var tOut = 0;
  		 			var checkBid = newBid - mfk.bid;
  		 			var message = [];
	  		 		if ( checkBid > 0 && active != 0 && tOut > -1000 ){
		  				db.ref('/items/'+ itemKey + '/bidList').push({
		  					bid : newBid,
		  					bidTimestamp : data.timeNow,
		  					userId : uid
		  				})
		  				message.push('200,wellDone')
		  			} else {
		  				message.push('403,Forbidden')
		  			}
		  			res.status(200).send(message);
 				})

	  		});
			
		})


	});


