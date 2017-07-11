(function() {
  'use strict';

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
    console.log(pointer);
    if (typeof pointer === "string") {
      console.log('1');
      return target[pointer];
    } else if (pointer.length <= 1) {
      console.log('2');
      return target[pointer.shift()];
    } else {
      console.log('3');
      var parentPointer = pointer.shift();
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

    // create Date object, init with time from API response
    var datetime = new Date(WEATHER.dt);
    var map = new Map([
      // set value for card-name as value name from WEATHER
      ['card-name', getValue(WEATHER, ['name'])],
      // set value for card-location as value sys.country from WEATHER
      ['card-location', getValue(WEATHER, ['sys', 'country'])],
      // set value for card-temperature as previously converted tempValueConverted
      ['card-temperature', tempValueConverted],
      // set value for card-icon as value weather[0].main from WEATHER
      ['card-icon', getValue(WEATHER, ['weather', 0, 'main'])],
      // set value for card-icon as value main.pressure from WEATHER
      ['card-pressure', getValue(WEATHER, ['main', 'pressure']) + " hPa"],
      // set value for card-icon as formated values from datetime object
      ['card-datetime', [datetime.getHours(), datetime.getMinutes()].join(':')]
    ]);

    return map;
  }

  function updateModel(element, mappedValues) {
    // get DOM element
    var card = document.getElementById(element);
    // Update it's inner data using values maped to class names
    for (var [key, value] of mappedValues) {
      card.getElementsByClassName(key)[0].innerHTML = value;
    }
  }


  function getWeather(lat, lon) {
    // console.log(lat, lon);

    var url = API.url + "weather?lat=" + String(lat) + "&lon=" + String(lon) + "&appid=" + API.key;
    var http_weather = new XMLHttpRequest();
    http_weather.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        // update Data with
        var data = updateData(response);
        updateModel('card-1', data);
        // updateDom(WEATHER);
      }
    };
    http_weather.open("GET", url, true);
    http_weather.send();
  }

  function getLocation() {
    var lat = 0, lon = 0;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log([lat, lon]);
        getWeather(lat, lon);
      });
    } else {
      console.log('geolocation IS NOT available');
    }
  }

  // var arr =
  getLocation();
  // console.log(arr);
  // var coordLat = arr[0], coordLon = arr[1];


}());
