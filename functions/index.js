//Cloud Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const query = require('./query');


admin.initializeApp(functions.config().firebase);
//query.initializeApp(functions.config().firebase);


const db = admin.database();
const timeCurrent = admin.database.ServerValue.TIMESTAMP;

const nodemailer = require('./node_modules/nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

/////// Item Service ///////

	//https://us-central1-auctkmutt.cloudfunctions.net/getItem >> all Items
	//https://us-central1-auctkmutt.cloudfunctions.net/getItems?itemId=XXXXXXX >> specific Items
	exports.getItems = functions.https.onRequest((req, res) => {

	  //res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
	 res.header("Access-Control-Allow-Origin", "*");
	 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	  const itemKey = req.query.itemId;

	  	if(itemKey != null){

	  		db.ref('/time').update({
  		 		timeNow :  timeCurrent
  		 	})

		  	db.ref('/items/'+ itemKey ).once('value', function(snapshot) {

	  			db.ref('/time').once('value', function(TimeSnapshot) {
	  		 		 var time_ = TimeSnapshot.val();
	  		 		 var getTime = time_.timeNow;

			  		 var data = snapshot.val();
			  		 var active = data.isActive;
			  		 var timeEnd = data.bid.endTime;  		 
			  		 	
			  		 	var tOut = timeEnd - data.getTime ;
		  		 		if ( tOut <= 0 && active != 0){
			  				db.ref('/items/'+ itemKey ).update({
			  					isActive :  0

			  				})
			  				data['isActive'] = 0;
			  			}

				  		var helpp = {
				  			 	_id: snapshot.key,
				  			 	endTime: timeEnd,
				  			 	current: data.bid.current,
				  			 	isActive: data.isActive,
				  			 	timeNow: getTime
				  		}

						res.status(200).send(helpp);



				})
			});
		}
		else {

		  	db.ref('/items').once('value', function(snapshot) {

		  			db.ref('/time').update({
		  		 		timeNow :  timeCurrent
		  		 	});

		  		 	db.ref('/time').once('value', function(TimeSnapshot) {
		  		 		var time_ = TimeSnapshot.val();
		  		 		var getTime = time_.timeNow;

		  		 	const arrays = [];

				  		snapshot.forEach(function(childSnapshot) {

						    var key_ = childSnapshot.key;
						    var childData = childSnapshot.val();
						    var active = childData.isActive;
			  		 		//var timeEnd = childData.bid.endTime;
			  		 		//console.log(childData.bid.endTime);
					      	childData['_id'] = key_;
					      	childData['timeNow'] = getTime;
/*
					      	const listArrays = [];

					      	db.ref('/items/' + key_ +'/bidList').orderByChild('bid')
							.once('value', function(snapBidList) {

							const listArrays_ = [];

						      	snapBidList.child('bidList').forEach(function(listSnapshot) {
							      	var listKey = listSnapshot.key;
							      	var listData = listSnapshot.val();
							      	listData['_id'] = listKey;
							      	listArrays_.push(listData);
						      	})

						    listArrays.push(listArrays_);

					      	})*/

			  		 		var tOut = childData.bid.endTime - getTime ;
			  		 		if ( tOut <= 0 && active != 0) {
				  				db.ref('/items/'+ key_ ).update({
				  					isActive :  0
				  				})
				  				childData['isActive'] = 0;

			  				}

			  				arrays.push(childData);

			  				//childData['bidList'] = listArrays;
					      	
					  	});
						res.status(200).send(arrays);
				  	});

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

			db.ref('/time').update({
  		 		timeNow :  timeCurrent
  		 	})

		  	db.ref('/items/'+ itemKey ).once('value', function(snapshot) {

	  			db.ref('/time').once('value', function(TimeSnapshot) {
	  		 		 var time_ = TimeSnapshot.val();
	  		 		 var getTime = time_.timeNow;

			  		 var data = snapshot.val();
			  		 var active = data.isActive;
			  		 var timeEnd = data.bid.endTime;  		 
			  		 	
			  		 	var tOut = timeEnd - data.getTime ;
		  		 		if ( tOut <= 0 && active != 0){
			  				db.ref('/items/'+ itemKey ).update({
			  					isActive :  0
			  				})
		  				}

			  			 var helpp = {
			  			 	_id: snapshot.key,
			  			 	endTime: timeEnd,
			  			 	current: data.bid.current,
			  			 	isActive: data.isActive,
			  			 	timeNow: getTime
			  			 }

					 res.status(200).send(helpp);

				})
			});
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

		  		db.ref('/time').update({
	  		 		timeNow :  timeCurrent
	  		 	});

				var data = snapshot.val();
				var active = data.isActive;
				var bidEndTime = data.bid.endTime;


				db.ref('/items/' + itemKey + '/bid').once('value', function(childSnapshot) {

					var bidLast = childSnapshot.val();

					db.ref('/time').update({
		  		 		  timeNow :  timeCurrent
		  		 		}).then( result => {

			  		 	db.ref('/time').once('value', function(TimeSnapshot) {
		  		 		 	var time_ = TimeSnapshot.val();
		  		 		 	var getTime = time_.timeNow;
		  		 		 	var maxBid = bidLast.maxBid;
		  		 		 	var openBid = data.bid.openBid;
			  		 		var tOut_ = bidEndTime - getTime;
		  		 			var checkBid = newBid - bidLast.current;
		  		 			var message = [];

		  		 			//validate int type
		  		 			if (typeof newBid === 'number' && newBid > 0 && (newBid%1) === 0){

				  		 		if ( active != 0 && tOut_ > 1000 && checkBid > 0 ){

					  		 		db.ref('/users/' + uid ).once('value', userSnapshot => {
					  		 		
									var _data = userSnapshot.val();
									var _info = _data.info;
									var _now = _data.now;

						  				if (newBid > maxBid) {

						  					if ( uid != bidLast.userId ) {

						  					db.ref('/items/'+ itemKey + '/bidList').orderByChild("bid").limitToLast(1)
						  						.once("child_added", findAutoSnapshot => {
						  							var a_data = findAutoSnapshot.val();
						  							var a_key = findAutoSnapshot.key;
						  							//console.log(a_key);
						  							/*if (a_data.auto === 2){
						  								db.ref('/items/'+ itemKey + '/bidList/' + a_key).update({
						  									auto : 1						  									
						  								})
						  							}*/
						  						}).then ( well => {

									  				db.ref('/items/'+ itemKey + '/bid').update({
									  					current : maxBid + bidLast.bidStep,
									  					userName : _info.displayName,
									  					userId : uid,
									  					maxBid : newBid,
									  					maxBidTime : getTime,
									  					count: bidLast.count+1
										  			})

										  			if (bidLast.count > 0) {
										  				
										  				if (bidLast.current > maxBid) {
										  					db.ref('/items/'+ itemKey + '/bidList').push({
											  					bid : maxBid,
											  					bidTimestamp : getTime,
											  					userId : bidLast.userId,
											  					userName : bidLast.userName,
											  					auto : 1 
									  						})
										  				}

									  					db.ref('/items/'+ itemKey + '/bidList').push({
										  					bid : maxBid + bidLast.bidStep,
										  					bidTimestamp : getTime,
										  					userId : uid,
										  					userName : _info.displayName,
										  					auto : 2
									  					})

									  				} else {
									  					db.ref('/items/'+ itemKey + '/bidList').push({
										  					bid : maxBid + bidLast.bidStep,
										  					bidTimestamp : getTime,
										  					userId : uid,
										  					userName : _info.displayName,
										  					auto : 2
									  					})
									  				}


									  				db.ref('/users/'+ uid + '/now/' + itemKey).set({
									  					bidTimestamp: getTime,
									  					itemId: itemKey									  					
										  			})
										  			

									  				//win bid
						  							res.status(200).send(['win']);

					  							})

								  			} else {

								  				db.ref('/items/'+ itemKey + '/bid').update({
								  					maxBid : newBid 
									  			})
									  			//increase max bid
									  			res.status(200).send(['increase']);
								  			}

						  				} else if (newBid <= maxBid) {

						  					if ( uid != bidLast.userId ) {

						  						db.ref('/items/'+ itemKey + '/bidList').orderByChild("bid").limitToLast(1)
						  						.once("child_added", findAutoSnapshot => {
						  							var a_data = findAutoSnapshot.val();
						  							var a_key = findAutoSnapshot.key;
						  							//console.log(a_key);
						  							if (a_data.auto === 2){
						  								db.ref('/items/'+ itemKey + '/bidList/' + a_key).update({
						  									auto : 1						  									
						  								})
						  							}
						  						}).then ( well => {

						  						if (newBid < maxBid) {

								  					db.ref('/items/'+ itemKey + '/bid').update({
									  					current : newBid + bidLast.bidStep,
									  					userName : bidLast.userName,
									  					userId : bidLast.userId,
									  					count: bidLast.count+1
										  			})
										  			db.ref('/items/'+ itemKey + '/bidList').push({
									  					bid : newBid,
									  					bidTimestamp : getTime,
									  					userId : uid,
									  					userName : _info.displayName,
									  					auto : 0
								  					})
										  			db.ref('/items/'+ itemKey + '/bidList').push({
									  					bid : newBid + bidLast.bidStep,
									  					bidTimestamp : bidLast.maxBidTime,
									  					userId : bidLast.userId,
									  					userName : bidLast.userName,
									  					auto : 2
								  					})

									  			} else {

									  				db.ref('/items/'+ itemKey + '/bid').update({
									  					current : newBid,
									  					userName : bidLast.userName,
									  					userId : bidLast.userId,
									  					count: bidLast.count+1
										  			})
										  			db.ref('/items/'+ itemKey + '/bidList').push({
									  					bid : newBid,
									  					bidTimestamp : getTime,
									  					userId : uid,
									  					userName : _info.displayName,
									  					auto : 0
								  					})
										  			db.ref('/items/'+ itemKey + '/bidList').push({
									  					bid : newBid,
									  					bidTimestamp : bidLast.maxBidTime,
									  					userId : bidLast.userId,
									  					userName : bidLast.userName,
									  					auto : 2
								  					})

									  			}
							  					//auto bid
							  					res.status(200).send(['autoBid']);

							  					})

									  		} else {
									  			//alrady win
							  						res.status(200).send(['alreadywin']);
									  		}

						  				}

						  			})

					  			} else {
					  				
					  				if ( active === 0 || tOut_ <= 1000 ) {
						  				//time up
						  				res.status(200).send(['timeup']);
						  			} else if( newBid < bidLast.current ){
						  				//already win
					  					res.status(200).send(['loser']);
					  				} else{
					  					//bad req.
					  					res.status(200).send(['403']);
					  				}
					  			}

				  			} else {
				  				//bad req.
					  			res.status(200).send(['403']);
				  			}

		 				})//then
					})

		  		})
	
			})
	  	} else {
	  		res.status(200).send(['404']);
	  	}
	});


//// catagories Service ////

	//https://us-central1-auctkmutt.cloudfunctions.net/addMockup
	exports.getCatagories = functions.https.onRequest((req, res) => {

		res.set('Cache-Control', 'public, max-age=20, s-maxage=20');
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

				db.ref('/orders/' + userId ).once('value', function(uSnapshot) {

					var data = uSnapshot.val();
					console.log(data)
					if (data != null) {
						var price_ = data.orderPrice;
						var totalPrice = parseInt( mfk.bid + price_ );
						var count_ = data.orderCount + 1;
					} else {
						var totalPrice = parseInt( mfk.bid );
						var count_ = 1 ;
					}
					console.log(mfk)


				  	db.ref('/orders/' + userId ).update({
				  		orderPrice: totalPrice,// sumPrice
				  		orderCount : parseInt(count_)
					})

					db.ref('/orders/' + userId + '/orderList').push({
		  				itemId : event.params.Itemid,
		  				itemName : data_.name,
		  				itemWinTime : mfk.bidTimestamp,
		  				itemPrice : data_.bid.current,
		  				itemPic : data_.img
					})

					//send mail

					db.ref('/users/'+ userId ).once('value',function(snapshot){
					  var user_ = snapshot.val();
					  var key = snapshot.key;
					  var uid = key;
					  var user = user_.info;
					  var displayName = user_.info.displayName;

					  const mailOptions = {
					    from: `AUCT-KMUTT <oateerapat@gmail.com>`,
					    to: user.email,
					    subject : 'You Win Auction !! ' + data_.name +'.',
					    text : 'Thanks you for join auction in auct-kmutt. You can check your win order.',
					    html: '<h1 style="text-align:center;color:#1779ba;">Congratulation</h1><h4 style="text-align:center" >Hi!! '+ displayName +'. ,Now you win auction '+ data_.name + ' @ '+ data_.bid.current + ' BHT</h4><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><img style="width:50%;max-width:300px;" src="'+ data_.img + '"></table><br><br><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><a href="https://auctkmutt.firebaseapp.com/" style="padding:10px 20px;font-size:28px;background:#1779ba;color:#fff;border-radius:5px;text-decoration:none;font-weight: bold;max-width:250px;">Go Now !!</a></table><br><br><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><img style="max-width:150px;margin:30px 0 0;" src="https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2F69cc3138-ef71-424c-8179-8356032c11c8.JPG?alt=media&token=14cb5c9b-170a-4781-98ca-e750ec6b25a1"><p style="text-align:center;margin-top:5px;">Auctions Kmutt Project</p></table><br><br><br>'
					    
					  };

					  	return mailTransport.sendMail(mailOptions).then(() => {
					      console.log('winOrder email sent to:', user.email);
					    }).catch(error => {
					      console.error('winOrder was an error send email:', error); 
					      console.log(user.email);
					    });

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

	exports.sendEmail = functions.database.ref('/test/test')
	  .onUpdate(event => {

		var nodemailer = require('./node_modules/nodemailer');
		const gmailEmail = encodeURIComponent(functions.config().gmail.email);
		const gmailPassword = encodeURIComponent(functions.config().gmail.password);
		const mailTransport = nodemailer.createTransport(
		    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


		db.ref('users/mEVupcmWzWNhnYYyTfTKd6qFVJJ3').once('value',function(snapshot){
		  var user_ = snapshot.val();
		  var key = snapshot.key;
		  var uid = key;
		  var user = user_.info;
		  var displayName = user_.info.displayName;


		  db.ref('items/-KwGANsw7KAy8X2DA3Vg').once('value',function(dsnapshot){

		  	var data_ = dsnapshot.val();

					  const mailOptions = {
					    from: `AUCT-KMUTT <oateerapat@gmail.com>`,
					    to: user.email,
					    subject : 'You Win Auction !! ' + data_.name ,
					    text : 'Thanks you for join auction in auct-kmutt. You can check your win order.',
					    html: '<h1 style="text-align:center;color:#1779ba;">Congratulation !!</h1><h4 style="text-align:center" >Hi!! '+ displayName +'., Now you win auction '+ data_.name + ' @ '+ data_.bid.current + ' BHT</h4><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><img style="width:50%;max-width:300px;" src="'+ data_.img + '"></table><br><br><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><a href="https://auctkmutt.firebaseapp.com/" style="padding:10px 20px;font-size:28px;background:#1779ba;color:#fff;border-radius:5px;text-decoration:none;font-weight: bold;max-width:250px;">Go Now !!</a></table><br><br><table style="min-width: 100%;border-collapse: collapse;table-layout: fixed!important;text-align:center;"><img style="max-width:150px;margin:30px 0 0;" src="https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2F69cc3138-ef71-424c-8179-8356032c11c8.JPG?alt=media&token=14cb5c9b-170a-4781-98ca-e750ec6b25a1"><p style="text-align:center;margin-top:5px;">Auctions Kmutt Project</p></table><br><br><br>'
					    
					  };

					return mailTransport.sendMail(mailOptions).then(() => {
				      console.log('New subscription confirmation email sent to:', user.email);
				    }).catch(error => {
				      console.error('There was an error while sending the email:', error); 
				      console.log(user.email);
				    });

			});

		  // The user just subscribed to our newsletter.


	   


	}); });



