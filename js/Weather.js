function loadWeatherJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/retrieveWeather', true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 };

function setWeather(weather_dt, time) {
    var time_index;
    var i;
    if (weather_dt.length > 0) {
        for (i = 0; i < weather_dt.length; i++) {
            if (weather_dt[i] >= time) {
                time_index = (i-1 > 0) ? i-1 : 0;
                setWeatherUI(all_weather[time_index]);
                return;
            }
        }
        
    }
};

function setWeatherUI(weatherData) {
    var icon_link = 'https://openweathermap.org/img/wn/'+ weatherData.icon + '@2x.png';
    $('.weather-icon img').attr('src', icon_link);
    $('.weather-description').text(weatherData.description.replace(/(^|\s)[a-z]/g, function(l){ return l.toUpperCase() }));
    $('.weather-rain').text(weatherData.clouds+"%");
    $('.weather-temp').text(Math.round(weatherData.temperature-273.15)+"°C");
};
