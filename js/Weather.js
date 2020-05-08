function loadWeatherJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'geo_json/weather.json', true); // Replace 'my_data' with the path to your file
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
                var icon_link = 'http://openweathermap.org/img/wn/'+ all_weather[time_index].icon + '@2x.png';
                var weather_at_time = all_weather[time_index];
                $('#weather-icon img').attr('src', icon_link);
                $('#weather-description').text(weather_at_time.description);
                $('#weather-rain').text(weather_at_time.clouds+"%");
                $('#weather-temp').text(Math.round(weather_at_time.temperature-273.15)+"°C");
                return;
            }
        }
        
    }
};