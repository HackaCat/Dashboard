/**
 * Use OpenWeatherMap API to get the weeks weather forcast
**/

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
]

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
    console.log('weather data', data) 


    ///weeather data 0 - today

    var dayOfWeek = [];

    for (var i = 0; i < 7; i++) {
      let dayData = data.list[i]; 
      if (i === 0) {
        renderToday(dayData, i);
      } else {
        renderOtherDay(dayData, i);
      }
    }
  } 
}

function renderToday (data, index) {
  let date = new Date(data.dt*1000);
  let weekday = days[date.getDay()];
  let month = months[date.getMonth()];
  let card = document.getElementsByClassName('day-0')[0];
  let day = date.getDate();

  // display strings
  let dateString = `${month} ${day}`;
  let dayString = `<b>Today</b> (${weekday})`;
  let dayTempString = `${parseInt(data.temp.min)} - ${parseInt(data.temp.max)}°C`;
  let feelsTempString = `${parseInt(data.feels_like.day)}°C`;
  let humidityString = `${data.humidity}%`;
  let precipitationString = `${data.rain}mm`;
  let windString = `${data.speed}m/s`;
  let iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  let description = data.weather[0].description;

  // render data
  card.getElementsByClassName('card-header-date')[0].innerHTML = dateString;
  card.getElementsByClassName('card-header-day')[0].innerHTML = dayString;
  card.getElementsByClassName('weather')[0].src = iconUrl;
  card.getElementsByClassName('description')[0].innerHTML = description;
  card.getElementsByClassName('day-temp')[0].innerHTML = dayTempString;
  card.getElementsByClassName('feels-temp')[0].innerHTML = feelsTempString;
  card.getElementsByClassName('humidity')[0].innerHTML = humidityString;
  card.getElementsByClassName('precipitation')[0].innerHTML = precipitationString;
  card.getElementsByClassName('wind')[0].innerHTML = windString;
  card.getElementsByClassName('meals')[0].id = weekday.toLowerCase() + '-meal';
}

function renderOtherDay (data, index) {
  let date = new Date(data.dt*1000);
  let weekday = days[date.getDay()];
  let month = months[date.getMonth()];
  let card = document.getElementsByClassName(`day-${index}`)[0];
  let day = date.getDate();
  console.log('weather', index, weekday, date, month)

  // display strings
  let dayTempString = `${parseInt(data.temp.min)} - ${parseInt(data.temp.max)}°C`;
  let feelsTempString = `${parseInt(data.feels_like.day)}°C`;
  let humidityString = `${data.humidity}%`;
  let precipitationString = `${data.rain}mm`;
  let windString = `${data.speed}m/s`;
  let iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  let description = data.weather[0].description;

  // render data
  card.getElementsByClassName('card-header-date')[0].innerHTML = day;
  card.getElementsByClassName('card-header-day')[0].innerHTML = weekday;
  card.getElementsByClassName('weather')[0].src = iconUrl;
  card.getElementsByClassName('description')[0].innerHTML = description;
  card.getElementsByClassName('day-temp')[0].innerHTML = dayTempString;
  card.getElementsByClassName('feels-temp')[0].innerHTML = feelsTempString;
  card.getElementsByClassName('humidity')[0].innerHTML = humidityString;
  card.getElementsByClassName('precipitation')[0].innerHTML = precipitationString;
  card.getElementsByClassName('wind')[0].innerHTML = windString;
  card.getElementsByClassName('meals')[0].id = weekday.toLowerCase() + '-meal';
}


window.weatherUpdate = function () {
  getWeather(weatherCallback);
}