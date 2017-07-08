var apiKey = "9239469f010d7bb17fcc5de5107d9852";
// TODO: Move global vars to objects
var WEATHER = {};


function updateData(newData) {
  WEATHER = newData;
  var cardMap = new Map([
    ['card-name', WEATHER.name],
    ['card-location', WEATHER.sys.country],
    ['card-temp', WEATHER.main.temp]
  ]);
  var card = document.getElementById('card-1');
  for (var [key, value] of cardMap) {
    card.getElementsByClassName(String(key))[0].innerHTML = value;
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
