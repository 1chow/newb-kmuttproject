//Cloud Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const query = require('./query');


admin.initializeApp(functions.config().firebase);
//query.initializeApp(functions.config().firebase);


const db = admin.database();
const timeCurrent = admin.database.ServerValue.TIMESTAMP;



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

				db.ref('/time').update({
				  	timeNow : timeCurrent
				})

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
						  		step: 30,
						  		open: 5,
						  		current : '30'
						  	},
						  	img:['a', 'b', 'c'],
						  	bouded : 15,
						  	own : 'jByPD6RZW2UUgTx7M305k2BrSrr2',
						})
					.then(snapshot => {
						db.ref('/items/' + snapshot.key + '/bidList').push({
							userId : '',
							bid : 30,
							bidTimestamp : timeCurrent
						});
						
						db.ref('/time').once("value" ,function(Csnapshot) {
							var fkTime = Csnapshot.val();
							var fk = fkTime.timeNow + ((7) * 60 * 1000)
							db.ref('/items/' + snapshot.key + '/bid').update({
								endTime: fk
							})
						});
				  	});
				//db.ref('/time').remove();
				};
		};

		res.status(200).send('Add now 16');
	});

	//https://us-central1-auctkmutt.cloudfunctions.net/resetItems
	exports.resetItems = functions.https.onRequest((req, res) => {

		db.ref('/items').once("value" ,function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		    	var i = i + 1;
		    	db.ref('/items/'+ childSnapshot.key ).update({
			    	bid:{
				  		startTime: timeCurrent,
				  		endTime: timeStack,
				  		step: 30,
				  		open: 5,
				  		current : '30'
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

	  //res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
	 res.header("Access-Control-Allow-Origin", "*");
	 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	  const itemKey = req.query.itemId;

	  	if(itemKey != null){

		  	db.ref('/items/'+ itemKey ).once('value', function(snapshot) {

		  		 var data = snapshot.val();
		  		 var active = data.isActive;
		  		 var timeEnd = data.bid.endTime;
		  		 
		  		 	db.ref('/items/'+ itemKey ).update({
		  		 		timeNow :  timeCurrent,
		  		 	})

	  		 		var tOut = timeEnd - data.timeNow ;
	  		 		if ( tOut <= 0 && active != 0){
		  				db.ref('/items/'+ itemKey ).update({
		  					isActive :  0
		  				})
	  				}

	  			 var helpp = {
	  			 	_id: snapshot.key,
	  			 	endTime: timeEnd,
	  			 	current: data.bid.current,
	  			 	isActive: data.isActive
	  			 }
				 res.status(200).send(helpp);
			});
		}
		else {

		  	db.ref('/items').once('value', function(snapshot) {

		  		const arrays = [];

			  		snapshot.forEach(function(childSnapshot) {

					    var key_ = childSnapshot.key;
					    var childData = childSnapshot.val();
					    var active = childData.isActive;
		  		 		//var timeEnd = childData.bid.endTime;
		  		 		//console.log(childData.bid.endTime);
				      	childData['_id'] = key_;

				      	const listArrays = [];

				      	childSnapshot.child('bidList').forEach(function(listSnapshot) {
					      	var listKey = listSnapshot.key;
					      	var listData = listSnapshot.val();
					      	listData['_id'] = listKey;
					      	listArrays.push(listData);
				      	})

				      	db.ref('/items').child(key_).update({
			  		 		timeNow :  timeCurrent,
			  		 	})

		  		 		var tOut = childData.bid.endTime - childData.timeNow ;
		  		 		if ( tOut <= 0 && active != 0) {
			  				db.ref('/items/'+ key_ ).update({
			  					isActive :  0
			  				})
		  				}

		  				childData['bidList'] = listArrays;
				      	arrays.push(childData);

				  	});

			   	res.status(200).send(arrays);
			});
	   	}
	});


	//https://us-central1-auctkmutt.cloudfunctions.net/getCurrentPrice?itemId=XXXXXXX >> specific Items
	exports.getCurrent = functions.https.onRequest((req, res) => {
		res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
		res.set('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		const itemKey = req.query.itemId;

	  	if(itemKey != null){

			db.ref('/items/'+ itemKey ).once('value', function(snapshot) {

		  		 var data = snapshot.val();
		  		 var active = data.isActive;
		  		 var timeEnd = data.bid.endTime;
		  		 
		  		 	db.ref('/items/'+ itemKey ).update({
		  		 		timeNow :  timeCurrent,
		  		 	})

	  		 		var tOut = timeEnd - data.timeNow ;
	  		 		if ( tOut <= 0 && active != 0){
		  				db.ref('/items/'+ itemKey ).update({
		  					isActive :  0
		  				})
	  				}

	  			 var helpp = {
	  			 	_id: snapshot.key,
	  			 	endTime: timeEnd,
	  			 	current: data.bid.current,
	  			 	isActive: data.isActive
	  			 }
				 res.status(200).send(helpp);
			});

		} else{
			res.status(200).send([404]);
		}
	});

	//https://us-central1-auctkmutt.cloudfunctions.net/postEndTime?itemId=XXXXXXX&endAt=XXXXXXXX >> specific Items
	exports.postEndTime = functions.https.onRequest((req, res) => {
		res.set('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		const end_ = req.query.endAt;
		const itemKey = req.query.itemId;

	  	if(itemKey != null){

		  		 	db.ref('/items/'+ itemKey +'/bid' ).update({
		  		 		endTime  :  end_,
		  		 	})
				 res.status(200);
		} else{
			res.status(200).send([404]);
		}
	});


////// Bit Service ///////

	//https://us-central1-auctkmutt.cloudfunctions.net/bidOrder?itemId=-KpnlbR3SbEGDnNqzDI7&bid=999&uId=jByPD6RZW2UUgTx7M305k2BrSrr2
	exports.bidOrder = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
		res.set('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		var itemKey = req.query.itemId;
		var newBid 	= parseInt(req.query.bid);
		var uid	= req.query.uId;

		if ( itemKey != null && uid != 0 && newBid != null ){

		  	db.ref('/items/' + itemKey ).once('value', function(snapshot) {

				var data = snapshot.val();
				var active = data.isActive;
				var bidEndTime = data.bid.endTime;


				db.ref('/items/' + itemKey + '/bidList').orderByChild('bid').limitToLast(1)
				.once('value', function(childSnapshot) {

					var bidLast = [];
					childSnapshot.forEach((duckSnap) => {
						const duck = duckSnap.val();
						bidLast.push(duck);
					});

					var mfk = bidLast[0];//bidLastWin
					console.log('mfk ' + mfk.bid);

					db.ref('/items/'+ itemKey).update({
		  		 		  timeNow :  timeCurrent,
		  		 		}).then(timeSnapshot => {

		  		 		var tOut_ = bidEndTime - data.timeNow;
		  		 		//var tOut = 0;
	  		 			var checkBid = newBid - mfk.bid;
	  		 			var bouded_ = parseInt(data.bouded) * 1000
	  		 			var expandTime = (data.timeNow) + (bouded_); //boudded
	  		 			var message = [];
		  		 		if ( checkBid > 0 && active != 0 && tOut_ > 1000 ){

		  		 		db.ref('/users/' + uid ).once('value', function(userSnapshot) {
		  		 		
						var _data = userSnapshot.val();
						var _info = _data.info;

			  				db.ref('/items/'+ itemKey + '/bidList').push({
			  					bid : newBid,
			  					bidTimestamp : data.timeNow,
			  					userId : uid,
			  					userName : _info.displayName
			  				})
			  				db.ref('/items/'+ itemKey + '/bid').update({
			  					current : newBid,
			  					userName : _info.displayName
			  				})
			  			})
			  				message.push(200)
			  			} else {
			  				message.push(403)
			  			}
			  			res.status(200).send(message);
	 				})
		  		});
	
			})
	  	} else {
	  		res.status(200).send([404]);
	  	}
	});


//// catagories Service ////

	//https://us-central1-auctkmutt.cloudfunctions.net/addMockup
	exports.getCatagories = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
		res.set('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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

	//https://us-central1-auctkmutt.cloudfunctions.net/getAccount
	//https://us-central1-auctkmutt.cloudfunctions.net/getAccount?userId=xxxxxxxx
	exports.getAccount = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
		res.set('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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

	//https://us-central1-auctkmutt.cloudfunctions.net/addMockup
	exports.createOrder = functions.https.onRequest((req, res) => {

		var userId = req.query.uId;

	  	db.ref('/orders/' + userId ).push({
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

/*	var eventSnapshot = event.data;
	var profilePictureSnapshot = eventSnapshot.child('profilePicture');
	if (profilePictureSnapshot.changed()) {
	  return createThumbnail(profilePictureSnapshot.val())
	    .then(url => {
	      return eventSnapshot.ref.update({ profileThumbnail: url });
	    });
	}*/


	exports.winOrder = functions.database.ref('/items/{Itemid}/isActive')
	  .onUpdate(event => {

	  	var itemKey = event.params.Itemid

		db.ref('/items/' + itemKey + '/bidList').orderByChild('bid').limitToLast(1)
		.once('value', function(childSnapshot) {

			var bidLast = [];
			childSnapshot.forEach((duckSnap) => {
				const duck = duckSnap.val();
				bidLast.push(duck);
			});

			db.ref('/items/' + itemKey ).once('value',function(snap){

				var data_ = snap.val();
				var totalPrice = 0;

				var mfk = bidLast[0];//bidLastWin
				var userId = mfk.userId;

				db.ref('/orders/' + userId ).once('value', function(childSnapshot) {

					var data = childSnapshot.val();
					
					if (data !== null) {
						var price_ = data.orderPrice;
						var totalPrice = parseInt( mfk.bid + price_ );
						var count_ = parseInt( data.orderCount ) + 1;
					} else {
						var totalPrice = parseInt( mfk.bid );
						var count_ = 1;
					}

				  	db.ref('/orders/' + userId ).update({
				  		orderPrice: totalPrice,// sumPrice
				  		orderCount : count_
					})

					db.ref('/orders/' + userId + '/orderList').push({
		  				itemId : event.params.Itemid,
		  				itemName : data_.name,
		  				itemWinTime : mfk.bidTimestamp,
		  				itemPrice : data_.bid.current,
		  				itemPic : data_.img
					})

				})//ref order by uid data


			})//ref item win
		    
		});// ref current by item win

	});


	//https://us-central1-auctkmutt.cloudfunctions.net/getOrder
	//https://us-central1-auctkmutt.cloudfunctions.net/getOrder?userId=xxxxxxxx
	exports.getOrder = functions.https.onRequest((req, res) => {

	  res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
	  res.set('Access-Control-Allow-Origin', '*');
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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




