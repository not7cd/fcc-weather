var apiKey = "9239469f010d7bb17fcc5de5107d9852";
// TODO: Move global vars to objects
var WEATHER = {};
var unitCelsius = true;

function getValue(target, pointer) {
  if (typeof pointer === "string") {
    console.log('1');
    return target[pointer];
  } else if (pointer.length <= 1) {
    console.log('2');
    return target[pointer[0]];
  } else {
    console.log('3');
    parentPointer = pointer.shift();
    return getValue(target[parentPointer], pointer);
  }
}

function updateData(newData) {
  WEATHER = newData;

  var temperature = unitCelsius ? (WEATHER.main.temp - 273.15) + "°C" : (5/9 * WEATHER.main.temp - 459.67) + "°F";
  var datetime = new Date(WEATHER.dt);
  var cardMap = new Map([
    ['card-name', getValue(WEATHER,['name'])],
    ['card-location', WEATHER.sys.country],
    ['card-temperature', temperature],
    ['card-icon', getValue(WEATHER,['weather','main'])],
    ['card-pressure', getValue(WEATHER,['main','pressure']) + " hPa"],
    ['card-datetime', [datetime.getHours(), datetime.getMinutes()].join(':')]
  ]);
  var card = document.getElementById('card-1');
  for (var [key, value] of cardMap) {
    card.getElementsByClassName(key)[0].innerHTML = value;
  }
}


function getWeather(key) {
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139" + "&appid=" + key;
  var http_weather = new XMLHttpRequest();
  http_weather.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      updateData(response);
      // updateDom(WEATHER);
    }
  };
  http_weather.open("GET", url, true);
  http_weather.send();
}

getWeather(apiKey);
