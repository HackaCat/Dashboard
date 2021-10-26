

// --------------------------
// Astronomy Picture and info callback
// --------------------------
var astroImage = document.getElementById('APOTD-image');
var astroTitle = document.getElementById('APOTD-title');
var astroDeets = document.getElementById('APOTD-deets');

function getAPOTD(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', secrets.APOTD_API, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function  astroCallback (err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    astroImage.src = data.url;
    astroTitle.innerHTML = data.title;
    astroDeets.innerHTML = data.explanation;
  }
}


// --------------------------
// Dad Joke API
// --------------------------
const dadJoke = document.getElementById('dad-joke');

function getDadJoke(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    secrets.DAD_JOKE
  );
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function dadJokeCallback (err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    console.log(data);
    if (data.type == 'single') {
      dadJoke.innerHTML = '<div class="joke-body">' + data.joke + '</div>';
    } else if (data.type == 'twopart') {
      dadJoke.innerHTML =
        '<div class="joke-body">' +
        data.setup +
        '</br>' +
        data.delivery +
        '</div>';
    }
  }
}


// --------------------------
// Cat Fact API
// --------------------------
const catFact = document.getElementById('cat-fact');

function getCatFact(callback) {
  console.log('getting cat facts...')
  var xhr = new XMLHttpRequest();
  xhr.open('GET', secrets.CAT_FACT, true);
  xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.onload = function () {
    var status = xhr.status;
    console.log('status' + status);
    if (status === 200) {
      console.log(xhr.response);
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function catFactCallback (err, data) {
  console.log('getting cat facts...')
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    console.log(data);
    catFact.innerHTML = '<div class="fact-body">' + data.fact + '</div>';
  }
}


window.otherUpdate = function () {
  getAPOTD(astroCallback);
  getCatFact(catFactCallback);
  getDadJoke(dadJokeCallback);
}