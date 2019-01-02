import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


const config = {
  apiKey: "AIzaSyDBNEPHDuEV94EAA4Cw8YX5uWwCMJF3g9o",
  authDomain: "reactslack-6b045.firebaseapp.com",
  databaseURL: "https://reactslack-6b045.firebaseio.com",
  projectId: "reactslack-6b045",
  storageBucket: "reactslack-6b045.appspot.com",
  messagingSenderId: "827773586491"
};
firebase.initializeApp(config);

export default firebase;