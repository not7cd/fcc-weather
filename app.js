var API = {
  "url": "http://api.openweathermap.org/data/2.5/",
  "key": "9239469f010d7bb17fcc5de5107d9852"
};

var config = {
  "tempInCelsius": true
};

// TODO: Move global vars to objects
var WEATHER = {};

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
  var tempValue = getValue(WEATHER, ['main', 'temp']);
  // convert temperature in K to C or F based on bool config.tempInCelsius
  var tempValueConverted = config.tempInCelsius ?
                            (tempValue - 273.15) + "°C" :
                            (5 / 9 * tempValue - 459.67) + "°F";
  var datetime = new Date(WEATHER.dt);
  var map = new Map([
    ['card-name', getValue(WEATHER, ['name'])],
    ['card-location', getValue(WEATHER, ['sys', 'country'])],
    ['card-temperature', tempValueConverted],
    ['card-icon', getValue(WEATHER, ['weather', 0, 'main'])],
    ['card-pressure', getValue(WEATHER, ['main', 'pressure']) + " hPa"],
    ['card-datetime', [datetime.getHours(), datetime.getMinutes()].join(':')]
  ]);

  return map
}

function updateModel(element, mappedValues) {
  // get DOM element
  var card = document.getElementById(element);
  // Update it's inner data using values maped to class names
  for (var [eltClass, value] of mappedValues) {
    card.getElementsByClassName(eltClass)[0].innerHTML = value;
  }
}


function getWeather() {
  var url = API.url + "weather?lat=35&lon=139" + "&appid=" + API.key;
  var http_weather = new XMLHttpRequest();
  http_weather.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      // update Data with
      data = updateData(response);
      updateModel('card-1', data);
      // updateDom(WEATHER);
    }
  };
  http_weather.open("GET", url, true);
  http_weather.send();
}

getWeather(API.key);
