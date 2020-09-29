var map_elem = document.getElementById('map');
var timeInput = $('.time');
var solarNoonInput = $('#solarNoonInput');
var currentMapTime_elem = $(".settime");
var currentMapDay_elem = $(".setday");
var currentMapDayMobile_elem = $(".setday-mobile");
var sunriseTime_elem = $(".sunrise");
var sunsetTime_elem = $(".sunset");
var highSun_elem = $(".high_sun_time");

function setSun(map, date, lat, longit) {
    var sunTimes = SunCalc.getTimes(date, lat, longit);
    var sunrise = sunTimes.sunrise;
    var sunset = sunTimes.sunset;
    var solarNoon = sunTimes.solarNoon;
    timeInput.attr('min', toSeconds(sunrise));
    solarNoonInput.attr('min', toSeconds(sunrise));
    timeInput.attr('max', toSeconds(sunset));
    solarNoonInput.attr('max', toSeconds(sunset));
    solarNoonInput.val(toSeconds(solarNoon));
    sunriseTime_elem.text(toHHMM(toParisHour(date,sunrise.getHours()), sunrise.getMinutes()));
    sunsetTime_elem.text(toHHMM(toParisHour(date,sunset.getHours()), sunset.getMinutes()));
    highSun_elem.text(toHHMM(toParisHour(date,solarNoon.getHours()), solarNoon.getMinutes()))
};

function setMapTime(map, dark_map, date, time) {
    setSelectedTime(date, time);
    if (time <= timeInput.attr('min') || time >= timeInput.attr('max')) {
        lightToDark(map, dark_map);
    } else if (map_elem.style.height === '0%') {
        darkToLight(map, dark_map);
    } else {
        map.triggerRepaint();
    };
};

function setSelectedTime(date, time) { // time is the time input
    timeInput.val(time);
    var hours = Math.floor(time / 60 / 60);
    var minutes = Math.floor(time / 60) % 60;
    var seconds = time % 60;
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    current_date = new Date();
    currentMapTime_elem.html(toHHMM(hours, minutes));
    if (toParisHour(current_date,current_date.getHours()) === hours && current_date.getMinutes() === minutes) {
        currentMapTime_elem.css('color','black');
    } else {
        currentMapTime_elem.css('color','gray');
    }
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    currentMapDay_elem.html(current_date.toLocaleDateString('fr-FR', options).replace(/(^|\s)[a-z]/g, function(l){ return l.toUpperCase() }).slice(0,-5));
    currentMapDayMobile_elem.html("&nbsp;("+current_date.toDateString().slice(4,-5)+")");
};

function lightToDark(map, dark_map) { 
    dark_map.setCenter(map.getCenter());
    dark_map.setZoom(map.getZoom());
    map_elem.style.height = '0%';
};

function darkToLight(map, dark_map) {
    map.setCenter(dark_map.getCenter());
    map.setZoom(dark_map.getZoom());
    map_elem.style.height = '100%';
};

function toSeconds(wTime) {
    return toParisHour(wTime,wTime.getHours())* 60 * 60 + wTime.getMinutes() * 60 + wTime.getSeconds();
};

function toParisHour(date, there_hour) {
    var offset = date.getTimezoneOffset()/60;
    if (offset != -2) {
        return (there_hour + offset + 2) % 24;
    }
    return there_hour;
};

function toHHMM(hours, minutes) {
    var h_dd, m_dd;
    if (minutes > 9) 
        m_dd = minutes; 
    else m_dd = "0" + minutes;
    if (hours > 9) 
        h_dd = hours; 
    else h_dd = "0" + hours;
    return h_dd + "h" + m_dd;
};
