const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = {

	 getDataBykey : function(snapshot){


			  	const arrays = [];
			    snapshot.forEach(function(childSnapshot) {		      
			      var key = childSnapshot.key;
			      var childData = childSnapshot.val();
			      childData['id'] = key;
			      arrays.push(childData);

			  });
			    return array;
		

	}

}