function showBatiDetailsPopup(pt_longlat, pt_xy) {
    if (popup.isOpen()) popup._closeButton.click();
    var features = [];
    if (pt_xy !== undefined) {
        features = map.queryRenderedFeatures(pt_xy, {layers:['batiterrasse-fill']});
    } else {
        point = map.project([pt_longlat.lng, pt_longlat.lat]);
        features = map.queryRenderedFeatures([point.x, point.y], {layers:['batiterrasse-fill']});
    }
    if (features.length) {
        popup.setLngLat(pt_longlat)
        .setHTML(features[0].properties.name + "<br>rating:" + features[0].properties.rating + "/5<br>price:" + features[0].properties.price + "<br>" + features[0].properties.address + "<br>" + features[0].properties.phone + "<br>" + features[0].properties.website + "<br>" + features[0].properties.hours)
        .addTo(map);
    };
};

function highlightBuilding(pt_longlat, pt_xy) {
    var features = map.queryRenderedFeatures(pt_xy, {layers:['3d-buildings']});
    if (features.length) {
        addPolygon(map, [features[0].geometry.coordinates[0]], 'current_bati');
        popup.setLngLat(pt_longlat)
        .setHTML(features[0].geometry.coordinates[0].length)
        .addTo(map);
    } else {
        removeLayerSource(map, 'current_bati');
    };
};

function addPolygon(map, coor, id) {
    removeLayerSource(map, id);
    map.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [coor]
            }
        }
    });
    map.addLayer({
        'id': id,
        'type': 'fill',
        'source': id,
        'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });
};

function removeLayerSource(map, id) {
    var mapLayer = map.getLayer(id);
    if (typeof mapLayer !== 'undefined') {
        map.removeLayer(id);
        map.removeSource(id);
    };
};

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'found.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 };
