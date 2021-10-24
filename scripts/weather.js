/**
 * Use OpenWeatherMap API to get the weeks weather forcast
**/


const weatherDivs = document.querySelectorAll('.weekday');
weatherDivs.forEach((el) => el.addEventListener('click', fillDayWithRecipe));


function getWeather(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', secrets.OPEN_WEATHER_API, true);
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


function weatherCallback (err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    var d = new Date();
    var weekday = [];
    weekday[0] = 'sunday';
    weekday[1] = 'monday';
    weekday[2] = 'tuesday';
    weekday[3] = 'wednesday';
    weekday[4] = 'thursday';
    weekday[5] = 'friday';
    weekday[6] = 'saturday';

    ///weeather data 0 - today

    var dayOfWeek = [];

    for (var i = 0; i < 7; i++) {
      let q = (d.getDay() + i) % 7;
      dayOfWeek = document.getElementsByClassName(weekday[q]);
      var icon = data.list[q].weather[0].icon;
      var temps = document.createElement('p');
      temps.innerHTML =
        '<img class="weather" src=http://openweathermap.org/img/wn/' +
        icon +
        '@2x.png></br>' +
        data.list[q].weather[0].description +
        ' </br> ' +
        '<b>High:</b>' +
        data.list[q].temp.max +
        'C' +
        '</br> <b>Low:</b> ' +
        data.list[q].temp.min +
        'C';
      dayOfWeek[0].append(temps);
      var feelsLike = document.createElement('p');
      feelsLike.innerHTML =
        '<b>Feels Like</b> ' + data.list[q].feels_like.day + 'C';
      dayOfWeek[0].append(feelsLike);
    }
  }
  var today = document.getElementsByClassName(weekday[d.getDay()]);
  var today_html = document.createElement('p');
  today_html.innerHTML = '<span class="today">TODAY</span>';
  today[0].append(today_html);
}

window.weatherUpdate = function () {
  getWeather(weatherCallback);
}