// START: variables
mapboxgl.accessToken = YOUR_MAPBOX_API_KEY;
var home_long = 2.3598517;
var home_lat = 48.8549916;
var popup = new mapboxgl.Popup();
var date = new Date();
var time = toSeconds(date);
var all_weather = []; var weather_dt_array = [];
var last_lnglat = null;
var trackuserlocationstart = false;

var map = window.map = new mapboxgl.Map({
    container: 'map',
    zoom: 14,
    center: [home_long, home_lat],//-74.0059, 40.7064],
    style: 'mapbox://styles/mapbox/streets-v11',
    hash: true
});
var dark_map = new mapboxgl.Map({
    container: 'dark-map',
    zoom: 14,
    center: [home_long, home_lat],//-74.0059, 40.7064],
    style: 'mapbox://styles/mapbox/dark-v10',
    hash: true
});
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});
// END: variables

// START: functions to run at page load
// sets right hand sun column and min/max of slider
setSun(map, date, home_lat, home_long);
// sets date/time and position of the slider thumb (needs to be set after sun)
setMapTime(map, dark_map, date, time);

// sets the weather info
loadWeatherJSON(function(response) {
    var weather_JSON = JSON.parse(response);
    all_weather = weather_JSON.all;
    weather_dt_array = weather_JSON.datetimes;
    var icon_link = 'http://openweathermap.org/img/wn/'+ all_weather[0].icon + '@2x.png';
    $('#weather-icon img').attr('src', icon_link);
    $('#weather-description').text(all_weather[0].description);
    $('#weather-rain').text(all_weather[0].clouds+"%");
    $('#weather-temp').text(Math.round(all_weather[0].temperature-273.15)+"°C");
});

// sets search bar and user location button
$('#geocoder').append(geocoder.onAdd(map));
$('#geolocate').append(geolocate.onAdd(map));
// END: functions to run at page load

// START: info box event listeners
// geocoder/geolocate sets last_lnglat for map to show popup on moveend
geocoder.on('result', function(e) {
    last_lnglat = {'lng':e.result.center[0],'lat':e.result.center[1]};
});
geolocate.on('trackuserlocationstart', function(e) {
    trackuserlocationstart = true;
});
geolocate.on('geolocate', function(e) {
    if (trackuserlocationstart && geolocate._watchState === "ACTIVE_LOCK") {
        last_lnglat = {'lng':e.coords.longitude, 'lat':e.coords.latitude};
        trackuserlocationstart = false;    
    }
});

// When slider changes input, update time/weather
$('#time').on('input', function(e) {
    time = $('#time').val();
    setWeather(weather_dt_array, (date.getTime()+7200)/1000);
    setMapTime(map, dark_map, date, time);
});

// When clicking the time, resets all to current time
$("#settime").on("click", function() {
    date = new Date(); // refresh current time
    time = toSeconds(date);
    setWeather(weather_dt_array, (date.getTime()+7200)/1000);
    setMapTime(map, dark_map, date, time);
});
// END: info box event listeners

// START: map event listeners
map.on('load', () => {
    // ask user to for location to center map
    geolocate.trigger();

    // 3d-buildings layer needs to be added to create shadows
    map.addLayer(threed_buildings_layer, 'road-label');

    // Add shadows layer
    map.addLayer(new BuildingShadows(), '3d-buildings');
    
    // To combat coloration issue on zoom
    map.removeLayer('building');
    map.addLayer(building_fill_layer, "road-label");
    map.addLayer(building_borders_layer, "road-label");

    // Add highlighted commerces with terrasses
    map.addSource('batiterrasse', {
      type: 'geojson',
      data: 'geo_json/ta_goog_polygon_found.geojson'
    });
    map.addLayer(batiterrasse_fill_layer, "road-label");
    map.addLayer(batiterrasse_point_layer, "road-label");

    // Add highlighted terrasses
    map.addSource('terrasses', {
      type: 'geojson',
      data: 'geo_json/terrasses_only.geojson'
    });
    map.addLayer(terrasse_fill_layer, "road-label");
    map.addLayer(terrasse_point_layer, "road-label");

    console.log("loaded");
});

// show popup on click
map.on('click', function(e) {
    if (popup.isOpen()) popup._closeButton.click();

    geolocate._watchState = "BACKGROUND";

    var point_xy = [e.point.x, e.point.y];
    var lngLat = e.lngLat;

    // highlight the building selected
    highlightBuilding(lngLat, point_xy);

    // mark as terrasse if terrasse
    features = map.queryRenderedFeatures(point_xy, {layers:['terrasse-fill']});
    if (features.length) {
        popup.setLngLat(lngLat)
        .setHTML('terrasse')
        .addTo(map);
    };
    // mark w/ commerce details if commerce
    showBatiDetailsPopup(lngLat, point_xy);
});

// On map move, show geocoder/geolocate commerce info
map.on('moveend', function() {
    if (last_lnglat != null) {
        showBatiDetailsPopup(last_lnglat);
        last_lnglat = null;
    }
});
// END: map event listeners