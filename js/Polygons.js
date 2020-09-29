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
        var hoursOpen = formatHours(features[0].properties.hours);
        popup.setLngLat(pt_longlat)
        .setHTML("<b>"+features[0].properties.name+"</b>" + formatRating(features[0].properties.rating) + 
            formatPrice(features[0].properties.price) + "<br>" + features[0].properties.address + 
            "<br>" + features[0].properties.phone + "<br>" + hoursOpen + features[0].properties.website)
        .addTo(map);
    };
};

function formatRating(r) {
    var rating = eval(r);
    if (!isNaN(rating)) {
        return "<br>Note: " + r + "/5";
    };
    return "";
};

function formatPrice(p) {
    if (p.length)
        return "<br>Prix: " + p;
    return "";
};

function formatHours(h) {
    var hours = eval(h);
    if (hours != null && hours.length) {
        var allHours = "";
        for (i = 0; i < hours.length; i++) {
            allHours += hours[i]["days"] + ": " + hours[i]["times"] + "<br>";
        };
        return allHours;
    };
    return "";
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

