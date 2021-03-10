var socket = io("http://localhost:3000/");

let links = [];

let isConnect = false;

let port;

socket.on('ok', () => {
  isConnect = true;
  if(port) {
    port.postMessage({isConnect: isConnect});
  }
  console.log('ok');
});

socket.on("disconnect", (reason) => {
  console.log(reason);
  isConnect = false;
  if(port) {
    port.postMessage({isConnect: isConnect});
  }
});

socket.on('links', (data) => {
  let keys = Object.keys(data);
  links = [];
  keys.forEach(el => {
    links.push({id: el, link: data[el]});
  });
  links.sort((a, b) => a.id - b.id);
  if(port) {
    port.postMessage({links: links});
  }
})

const newLink = (e) => socket.emit('storeLink', e);
const deleteLink = (e) => socket.emit('deleteLink', e);
const updateLinks = (e) => socket.emit('updateLinks');

chrome.runtime.onConnect.addListener(function(p) {
  port = p;
  port.onMessage.addListener(function(msg) {
    switch(Object.keys(msg)[0]) {
      case 'fetchLinks':
        port.postMessage({links: links});
        break;
      case 'storeLink':
        newLink(msg.storeLink);
        break;
      case 'deleteLink':
        deleteLink(msg.deleteLink);
        break;
      case 'updateStatus':
        port.postMessage({isConnect: isConnect});
        break;
      case 'updateLinks':
        updateLinks();
        break;
    }
  });
});