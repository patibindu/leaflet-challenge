//check to see if the link is working
console.log("Start of map using logic_1");

//url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

//logic_1 creates the initial tile layers, a layerGroup for the earthquakes and a layer control


//Create the base layers

let street =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', 
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  //create an empty (new) leaflet layerGroup for earthquakes
  let earthquakes = new L.layerGroup();

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  //Createour map, giving streetmap and earthquakes layers
  let MyMap = L.map("map", {
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

  //get earthquake data

  let Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  //perform d3.json AJAX to the query URL

  d3.json(Url).then(function(data) {
    console.log(data);
  });