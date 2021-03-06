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



io.on('connection', (socket) => {
  
  socket.emit('ok');

  socket.emit('links', [
    'google.com',
    'lol.com'
  ]);

});

http.listen(process.env.PORT, () => {
  console.log('listening on *:'+process.env.PORT);
});