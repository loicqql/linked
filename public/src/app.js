var socket = io("http://localhost:3000/");

socket.on('ok', () => {
  console.log('ok');
});

socket.on("disconnect", (reason) => {
  console.log(reason);
});

socket.on('links', (data) => {
  console.log(data);
})

function newLink(e) {
  socket.emit('new link', e);
}