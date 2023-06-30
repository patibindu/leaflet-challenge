//check to see if the link is working
console.log("Start of map using logic_1");

//url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

// logic_1 creates the initial tile layers, a layerGroup for the earthquakes and a layer control

// logic_2 gets the USGS earthquake data and creates a circlemarker
// using a common radius, common color and popup with location, time and magnitude

// logic_3 creates circleMarker with radius as a function of magnitude
// color as a function of depth: function called markerColor()
// with an overall styleInfo function that calls bothstyleInfo()

// logic_4 creates a basic legend for the color used to 
// indicate depth of the earthquake and add info box to explain circle radius is magnitude
// and color is a function of depth

// Create the base layers

let street =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', 
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + 
'<br> Lead Analyst: Hima <a href="https://github.com/patibindu/leaflet-challenge">Github Repo</a>' 
})
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' + '<br> Lead Analyst: Hima <a href="https://github.com/patibindu/leaflet-challenge">Github Repo</a>' 
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // create an empty (new) leaflet layerGroup for earthquakes
  let earthquakes = new L.layerGroup();

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Createour map, giving streetmap and earthquakes layers
  let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //get earthquake data from USGS

  let Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  //perform d3.json AJAX to the URL

  d3.json(Url).then(function(data) {
    console.log(data.features[0]);

    function markerSize(magnitude) {

      //note we are using USGS feed for magnitude of 1+ therefore we will not have circle with radius 0
      return magnitude * 4
    }

    //create a function for markerColor using depth (km)
    function markerColor(depth) {

      return depth > 150 ? '#d73027' :
      depth > 100 ? '#fc8d59' :
      depth > 50 ? '#fee08b' :
      depth > 25 ? '#d9ef8b' :
      depth > 10 ? '#91cf60' :      
              '#1a9850';
      }

     //colorbrewer green to Red #d73027 #fc8d59 #fee08b #d9ef8b #91cf60 #1a9850

    //create a geoJSON layer using data
    function styleInfo(feature) {
      return {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8

      };
    }

    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
        },

        //use styleInfo to define circleMarker style
        style: styleInfo,

      //use onEachFeature to add popup with location, time and magnitude and length
      onEachFeature: function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
        <h3>Magnitude: ${feature.properties.mag.toLocaleString()}<h3>
        <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}<h3>
        `);
        }
        
  }).addTo(earthquakes);

  //add legend

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 25, 50, 100, 150],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += 'Depth (km) <br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

// info control

let info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>USGS Live Earthquake Feed for Past 7 Days</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Circle radius is a function of Magnitude' +
        '<br>' +
        'Circle color is a function of Depth');
};

info.addTo(myMap);

  
  //data is not available below this point
});


