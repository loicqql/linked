const onEvent = (selectorCss, event, functionCallback) => {document.querySelectorAll(selectorCss).forEach(el => {el.addEventListener(event, function() {functionCallback(this)})})};

let port;

window.addEventListener('DOMContentLoaded', () => {
  port = chrome.runtime.connect({name: "linked"});
  port.postMessage({fetchLinks: ""});

  port.onMessage.addListener(function(msg) {
    switch(Object.keys(msg)[0]) {
      case 'links':
        displayLinks(msg.links);
    }
  });

  document.querySelector('.linked__input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      port.postMessage({storeLink: e.target.value});
      e.target.value = '';
    }
  });

})

function displayLinks(links) {
  let linked = document.querySelector('.linked');
  linked.innerHTML = '';

  links.forEach(el => {
    let a = document.createElement('a');
    a.setAttribute('href', el.url);
    a.setAttribute('target', '_blank');
    a.setAttribute('class', 'link');
    a.dataset.id = el.id;
    let p = document.createElement('p');
    p.textContent = el.url;
    a.appendChild(p);
    linked.appendChild(a);
  });
  linked.scrollTop = linked.scrollHeight;

  
  onEvent('.link', 'click', (e) => {
    port.postMessage({deleteLink: e.dataset.id});
  })

} 