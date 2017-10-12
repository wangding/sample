var items;
get(show);

function get(cb) {
  document.getElementById('output').innerHTML = "";

  fetch('https://wd-todo-api.herokuapp.com/').then(function(res) {
    res.text().then(function(data) {
      items = JSON.parse(data);
      console.log(items);
      cb();
    });
  });
}

function show() {
  var str = '<ul>\n';

  for(var i=0; i<items.length; i++) {
    str += '<li>' + items[i] + '</li>\n';
  }

  str += '</ul>';
  console.log(str);
  document.getElementById('output').innerHTML = str;
}

function add() {
  var item = document.getElementById('todo').value;

  if(item === '') return;
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://wd-todo-api.herokuapp.com');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(item);

  items.push(item);
  show();
}
