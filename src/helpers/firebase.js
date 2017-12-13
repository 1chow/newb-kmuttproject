import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAcbC0kF3YHxeQOXA7De0NYKAVXsQ5lYYw",
    authDomain: "auctkmutt.firebaseapp.com",
    databaseURL: "https://auctkmutt.firebaseio.com",
    storageBucket: "auctkmutt.appspot.com",
  }

firebase.initializeApp(config)

export const db = firebase.database().ref()
export const db2 = firebase.database()
export const firebaseAuth = firebase.auth

export function auth (email, pw, displayName) {
  let firstName = displayName.slice(0, 1)
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then( user =>  {
      db.child(`users/${user.uid}/info`)
        .update({
            displayName: displayName,
            email: user.email,
            uid: user.uid,
            photoUrl: 'https://via.placeholder.com/500/5c5c5c/ffffff?text='+firstName,
            role: 'member',
            address:'Enter your address'
        })
        .then(user.updateProfile({
          displayName: displayName,
          photoUrl: 'https://via.placeholder.com/500/5c5c5c/ffffff?text='+firstName,
        }))
    })
}

export function login (email, pw , close) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
    .then(close)
}

export function logout () {
  return firebaseAuth().signOut()
}

