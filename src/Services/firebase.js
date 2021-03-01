import React from 'react'
import firebase from 'firebase'
import 'firebase/analytics'
import 'firebase/auth'
// import "firebase/firestore";

var firebaseConfig = {
  apiKey: 'AIzaSyDiuwZTiG0kzGIi7P3K1O_QxZc1WN8OT8U',
  authDomain: 'react-chat-9238b.firebaseapp.com',
  projectId: 'react-chat-9238b',
  storageBucket: 'react-chat-9238b.appspot.com',
  messagingSenderId: '198086917141',
  appId: '1:198086917141:web:5d557864c9fc744bf0221c',
  measurementId: 'G-1FGMY9YERD',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase
