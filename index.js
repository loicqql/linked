const firebase = require('firebase');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

var firebaseConfig = {
  apiKey: process.env.F_APIKEY,
  authDomain: process.env.F_AUTHDOMAIN,
  projectId: process.env.F_PROJECTID,
  storageBucket: process.env.F_STORAGEBUCKET,
  messagingSenderId: process.env.F_MESSAGINGSENDERID,
  appId: process.env.F_APPID
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore().collection('links').doc(process.env.ID_DOC);
const makeID = () => {return Array(4).fill(null).map(() => Math.random().toString(36).substr(2)).join('')};

io.on('connection', (socket) => {

  console.log('a')
  
  socket.emit('ok');

  socket.emit('links', [
    'google.com',
    'lol.com'
  ]);

  socket.on("new link", (data) => {
    db.set({
      [makeID()]: data
    },{merge: true});
  });

});

http.listen(process.env.PORT, () => {
  console.log('listening on *:'+process.env.PORT);
});