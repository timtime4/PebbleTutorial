var dictionary = {
  "KEY_TEMPERATURE" : temperature,
  "KEY_CONDITIONS" : conditions
};

// Send to Pebble
Pebble.sendAppMessage(dictionary,
  function(e) {
    console.log("Weather info sent to Pebble successfully!");
  }, 
  function(e){
    console.log("Error sending weather info to Pebble");
  }
);



// Listen for when watchface is ready
Pebble.addEventListener('ready',
      function(e){
          console.log("Pebble Kit JS is ready!");
      }
                        
      // get the initial weather
      getWeather();
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appMessage',
      function(e){
        console.log("AppMessage Received!");
        getWeather();
      }
);

var xhrRequest = function (url, type, callback){
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos){
  // Request info about user's location
  // construt URL
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" +
      pos.coords.latitude + "&lon=" + pos.coords.longitude;
  
  xhrRequest(url, GET, 
          function(responseText){
              var json = JSON.parse(responseText);
              var temperature = Math.round(json.main.temp - 273.15,);
              console.log("Temperature is " + temperature);
              
              var conditions = json.weather[0].main;
              console.log("Conditions are " + conditions);
          }
  );
}

function locationError(err){
  console.log("Error requesting location!");
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}