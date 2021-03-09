var socket = io("http://localhost:3000/");

let links = [];

let port;

socket.on('ok', () => {
  console.log('ok');
});

socket.on("disconnect", (reason) => {
  console.log(reason);
});

socket.on('links', (data) => {
  let keys = Object.keys(data);
  links = [];
  keys.forEach(el => {
    links.push({id: [el], url: [data[el]]});
  });
  links.sort((a, b) => a.id - b.id);
  if(port) {
    port.postMessage({links: links});
  }
})

const newLink = (e) => socket.emit('storeLink', e);
const deleteLink = (e) => socket.emit('deleteLink', e);

chrome.runtime.onConnect.addListener(function(p) {
  port = p;
  port.onMessage.addListener(function(msg) {
    switch(Object.keys(msg)[0]) {
      case 'fetchLinks':
        port.postMessage({links: links})
        break
      case 'storeLink':
        newLink(msg.storeLink);
        break
      case 'deleteLink':
        deleteLink(msg.deleteLink);
    }
  });
});