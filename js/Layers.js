var threed_buildings_layer = {
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
        'fill-extrusion-color': '#f0ebf4',
        'fill-extrusion-height': ["number", ["get", "height"], 5], // ["number", value, fallback_value]
        'fill-extrusion-base': ["number", ["get", "min_height"], 0],
        'fill-extrusion-opacity': 0 // is hidden
    }
};

var building_fill_layer = {
    'id': 'building-fill',
    'source': 'composite',
    'source-layer': 'building',
    'type': 'fill',
    'minzoom': 13,
    'paint': {
        'fill-color': '#e6e4e0'
    }
};

var building_borders_layer = {
    'id': 'building-borders',
    'source': 'composite',
    'source-layer': 'building',
    'type': 'line',
    'minzoom': 13,
    'paint': {
        'line-width': 0.7,
        'line-color': '#cfccc8'
    }
};

var batiterrasse_fill_layer = {
    'id': 'batiterrasse-fill',
    'type': 'fill',
    'source': 'batiterrasse',
    'paint': {
    'fill-color': '#088',
    'fill-opacity': 1
    },
    'filter': ['==', '$type', 'Polygon']
};

var batiterrasse_point_layer = {
    'id': 'batiterrasse-point',
    'type': 'circle',
    'source': 'batiterrasse',
    'paint': {
    'circle-radius': 1,
    'circle-color': '#088'
    },
    'filter': ['==', '$type', 'Point']
};

var terrasse_fill_layer = {
    'id': 'terrasse-fill',
    'type': 'fill',
    'source': 'terrasses',
    'paint': {
    'fill-color': '#CA278C',
    'fill-opacity': 1
    },
    'filter': ['==', '$type', 'Polygon']
};

var terrasse_point_layer = {
    'id': 'terrasse-point',
    'type': 'circle',
    'source': 'terrasses',
    'paint': {
    'circle-radius': 1,
    'circle-color': '#3e3e3e'
    },
    'filter': ['==', '$type', 'Point']
};
