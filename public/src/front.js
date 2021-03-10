const onEvent = (selectorCss, event, functionCallback) => { document.querySelectorAll(selectorCss).forEach(el => { el.addEventListener(event, function () { functionCallback(this) }) }) };

let port;

window.addEventListener('DOMContentLoaded', () => {
  port = chrome.runtime.connect({ name: "linked" });
  port.postMessage({ fetchLinks: "" });
  port.postMessage({ updateStatus: "" });

  port.onMessage.addListener(function (msg) {
    switch (Object.keys(msg)[0]) {
      case 'links':
        displayLinks(msg.links);
      case 'isConnect':
        typeof msg.isConnect === 'boolean' ? displayStatus(msg.isConnect) : '';
    }
  });

  document.querySelector('.linked__input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value != '') {
      if (e.target.value.startsWith('https://') || e.target.value.startsWith('http://')) {
        let domain = e.target.value.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        port.postMessage({ storeLink: {text: domain, url: e.target.value}});
        e.target.value = '';
      }
    }
  });

  onEvent('.socket_status', 'click', () => {
    port.postMessage({ updateStatus: '' });
    port.postMessage({ updateLinks: '' });
  });

  onEvent('.addTabUrl', 'click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0].url) {
        if (tabs[0].url.startsWith('https://') || tabs[0].url.startsWith('http://')) {
          let domain = tabs[0].url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
          port.postMessage({ storeLink: {text: domain, url: tabs[0].url} });
        }
      }
    });
  });
})

function displayLinks(links) {
  let linked = document.querySelector('.linked');
  linked.innerHTML = '';

  links.forEach(el => {
    let div = document.createElement('div');
    div.setAttribute('class', 'link');
    let a = document.createElement('a');
    a.setAttribute('href', el.link.url);
    a.setAttribute('target', '_blank');
    let p = document.createElement('p');
    p.setAttribute('title', el.link.url);
    p.textContent = el.link.text;
    a.appendChild(p);
    div.appendChild(a);
    let span = document.createElement('span');
    span.setAttribute('class', 'material-icons');
    span.textContent = 'remove_circle_outline';
    span.dataset.id = el.id;
    div.appendChild(span);

    linked.appendChild(div);

  });
  linked.scrollTop = linked.scrollHeight;

  onEvent('.link .material-icons', 'click', (e) => {
    port.postMessage({ deleteLink: e.dataset.id });
  });
}

function displayStatus(e) {
  let el = document.querySelector('.socket_status');
  el.classList.remove('connect');
  if (e) {
    el.classList.add('connect');
  }
}