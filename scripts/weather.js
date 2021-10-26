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
  let description = data.weather[0].description.replaceAll(' ', '&nbsp');
  let sunrise = dateTo24hourTime(new Date(data.sunrise*1000));
  let sunset = dateTo24hourTime(new Date(data.sunset*1000));
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
  card.getElementsByClassName('sunrise')[0].innerHTML = sunrise;
  card.getElementsByClassName('sunset')[0].innerHTML = sunset;
  card.getElementsByClassName('meals')[0].id = weekday.toLowerCase() + '-meal';
  card.getElementsByClassName('meal')[0].setAttribute('data-day', weekday.toLowerCase());

  markExtremeWeather(card, data);
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
  let description = data.weather[0].description.replaceAll(' ', '&nbsp');

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
  card.getElementsByClassName('meal')[0].setAttribute('data-day', weekday.toLowerCase());

  markExtremeWeather(card, data);
}

function markExtremeWeather (card, data) {
  // mark extreme weather values with colors
  let tempClasses = 'day-temp';
  if (data.temp.max > 25) {
    tempClasses += ' gradient red';
  } else if (data.temp.max > 18) {
    tempClasses += ' gradient orange';
  } else if (data.temp.min < 5) {
    tempClasses += ' gradient blue';
  }
  card.getElementsByClassName('day-temp')[0].setAttribute('class', tempClasses);


  // mark extreme values with colors
  let rainClasses = 'precipitation';
  if (data.rain > 10) {
    rainClasses += ' gradient blue';
  } else if (data.rain > 25) {
    rainClasses += ' gradient red';
  }
  card.getElementsByClassName('precipitation')[0].setAttribute('class', rainClasses);

  // mark extreme values with colors
  let windClasses = 'wind';
  if (data.speed > 10) {
    windClasses += ' gradient blue';
  } else if (data.speed > 25) {
    windClasses += ' gradient red';
  }
  card.getElementsByClassName('wind')[0].setAttribute('class', windClasses);
}


window.weatherUpdate = function () {
  getWeather(weatherCallback);
}