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

io.on('connection', (socket) => {

  console.log('a');

  socket.emit('ok');

  db.get().then((doc) => {
    if (doc.exists) {

      socket.emit('links', doc.data());

    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

  // StoreLink

  socket.on("storeLink", (data) => {

    db.set({
      [new Date().getTime()]: data
    }, { merge: true }).then(() => {

      db.get().then((doc) => {
        if (doc.exists) {

          socket.emit('links', doc.data());

        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

    })
  });

  //DeleteLink

  socket.on("deleteLink", (data) => {
    db.update({
      [data]: firebase.firestore.FieldValue.delete()
    }).then(() => {
      db.get().then((doc) => {
        if (doc.exists) {

          socket.emit('links', doc.data());

        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    })
  });

});

http.listen(process.env.PORT, () => {
  console.log('listening on *:' + process.env.PORT);
});