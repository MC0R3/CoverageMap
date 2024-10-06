// Gebruik van de variabelen vanuit het `config` object
const startLat = config.startLat;
const startLon = config.startLon;
const startZoom = config.startZoom || 10;
const minZoom = config.minZoom || 10;
const maxZoom = config.maxZoom || 18;
const areas = config.areas;
const areasText = config.areasText.singular;
const areasTextPlural = config.areasText.plural;
const tileserver = config.tileserver;
const legendSort = config.legendSort !== false ? '1' : '0';

let longestName = 0;

// Layers
const polygonLayer = new L.LayerGroup();
const borderLayer = new L.LayerGroup();

// Map
const map = L.map('mapid', {
    preferCanvas: true,
    layers: [borderLayer, polygonLayer],
}).setView([startLat, startLon], startZoom);
L.tileLayer(tileserver, {
    minZoom: minZoom,
    maxZoom: maxZoom,
}).addTo(map);

loadBorderPolygons();

// Information
const info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = `<b>${capitalize(areasText)} Selected:</b><br>` + (props ?
        `<b>${props.name}</b><br>Daily stats:<br>IV scanned ${props.IVscanned}<br>Hundo ${props.hundo}<br>Nundo ${props.nundo}<br>Size ${props.size} km<sup>2</sup>` :
        `Hover over a ${areasText}`);
};
info.addTo(map);

// Legend
const legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    const areas = loadScanAreaPolygons();
    const div = L.DomUtil.create('div', 'info legend');
    let areaNames = Object.keys(areas);

    // Initialiseer de html variabele
    let html = '';

    // Voeg de gewenste HTML-inhoud toe aan de html variabele
    areaNames.forEach(name => {
        html += `<div>${name}</div>`; // Voeg hier je gewenste HTML-structuur toe
    });

    // Zet de opgebouwde html in de div
    div.innerHTML = html;
    return div;
};
legend.addTo(map);


function centerMap(lat, lng, zoom = 13) {
    map.setView([lat, lng], zoom || 13)
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: feature.properties.color
    };
}

function highlightFeature(e) {
    let layer = e.target;
    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    const properties = e.target.feature.properties;
    const zoom = properties.zoom || 13;
    map.fitBounds(e.target.getBounds(), {
        maxZoom: zoom,
    });
}

function geodesicArea(latLngs) {
    let pointsCount = latLngs.length,
        area = 0.0,
        d2r = Math.PI / 180,
        p1, p2;
    if (pointsCount > 2) {
        for (let i = 0; i < pointsCount; i++) {
            p1 = latLngs[i];
            p2 = latLngs[(i + 1) % pointsCount];
            area += ((p2[0] - p1[0]) * d2r) * // lng
                (2 + Math.sin(p1[1] * d2r) + Math.sin(p2[1] * d2r)); // lat
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;
    }
    return Math.abs(area);
}

function convertAreaToSqkm(value) {
    return value * 1.0E-6;
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function capitalize(text) {
    const firstChar = text[0].toUpperCase();
    const rest = text.substring(1);
    return firstChar + rest;
}

function loadScanAreaPolygons() {
    let areas = {};
    $.ajaxSetup({
        async: false,
    });
    $.getJSON('./areas.json', function(data) {
        try {
            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: function(features, featureLayer) {
                    if (!features.properties.hidden) {
                        areas[features.properties.name] = features.properties;

                        const coords = features.geometry.coordinates[0];
                        const areaSize = geodesicArea(coords);
                        const size = convertAreaToSqkm(areaSize).toFixed(2);
                        featureLayer.on({
                            mouseover: highlightFeature,
                            mouseout: resetHighlight,
                            click: zoomToFeature
                        });
                        features.properties.size = size;
                        features.properties.color = features.properties.color || getRandomColor();
                        features.properties.center = featureLayer.getBounds().getCenter();
                        featureLayer.setStyle({
                            weight: features.properties.weight || 2,
                            opacity: features.properties.opacity || 1,
                            dashArray: features.properties.dashArray || '3',
                            fillOpacity: features.properties.fillOpacity || 0.7,
                            fillColor: features.properties.color,
                        });
                    }
                }
            });
            polygonLayer.addLayer(geojson);
        } catch (err) {
            console.error('Failed to load areas.json file\nError:', err);
        }
    });
    return areas;
}

function loadBorderPolygons() {
    $.getJSON('./borders.json', function(data) {
        try {
            const geojson = L.geoJson(data, {
                onEachFeature: function(features, featureLayer) {
                    featureLayer.setStyle({
                        fill: false,
                        color: features.properties.color || 'red',
                        weight: features.properties.weight || 3,
                        interactive: false,
                    });
                    const polyline = L.polyline(features.geometry.coordinates[0])
                    polyline.addTo(map);
                }
            });
            borderLayer.addLayer(geojson);
        } catch (err) {
            console.error('Failed to load borders.json file\nError:', err);
        }
    });
}