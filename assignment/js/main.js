////////////////////////////////////
// The user adds a marker on the map
// The five closest points should be represented as separate elements in the sidebar
// When the user clicks on an element in the sidebar, the corresponding point on the map should become highlighted
////////////////////////////////////

var data = "https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/master/Landmark/Public_Art/LANDMARK_PublicArt.geojson";
var markers;
var turfFeatures;
var userMarker;
var nearest;
var nearestFive;

// Initialize Leaflet Draw
var drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    marker: true,
    rectangle: false,
  }
});

map.addControl(drawControl);

// A filter function that filter out the nearest point every time
// (this function will be used in the findNearestFive function)
var filter = function(parsedFeatures){
  var filtered = _.filter(parsedFeatures, function(feature){
    return feature.properties.ArtID != nearest.properties.ArtID;
  });
  return filtered;
};

// A function that find the nearest points in the existed dataset from the user specified location
// the "num" parameter specifies how many nearest points are of interests
var findNearestSet = function(userMarkerPoint,parsed, num){
  nearestSet = [];
  parsedFeatures = parsed.features;
  parsedFeatureCollection = turf.featurecollection(parsedFeatures);
  var i;
  for (i=0; i<num; i++){
    nearest = turf.nearest(userMarkerPoint, parsedFeatureCollection);
    nearestSet.push(nearest);
    parsedFeatures = filter(parsedFeatures);
    parsedFeatureCollection = turf.featurecollection(parsedFeatures);
  }
};

// Show info of nearest points on the sidebar
var NearestSetSidebar = function(nearestSet){
  return _.each(nearestSet, function(near){
      $('#nearestSet_h1').show();
      $('#nearestSet_p').show();
      // append info
      $('#shapes').append('<div class="shape" id=' + near.properties.ArtID  + '><h1> '+ near.properties.Title.replace(/"/g,'') + '</h1><p><strong>Category: &nbsp</strong>'+ near.properties.Category + '</p><p><strong>Artist: &nbsp</strong>'+ near.properties.First_Name + ' ' + near.properties.Last_Name + '</p></div>');
      // reset marker style when the user click on the corresponding item on the sidebar
      var ArtID = "#".concat(near.properties.ArtID);
      $(ArtID).click(function(){
        return _.each(markers._layers, function(x){
          if(x.feature.properties.ArtID == near.properties.ArtID){
            x.setStyle({color:"#FF8A16", fillColor:"#FF8A16"});
          }
        });
      });
    });
};

// Run every time Leaflet draw creates a new layer
map.on('draw:created', function (e) {
    var type = e.layerType; // The type of shape
    var layer = e.layer; // The Leaflet layer for the shape
    var id = L.stamp(layer); // The unique Leaflet ID for the layer
    //Remove previous user-defined marker if it existed
    if (typeof userMarker != "undefined"){
      map.removeLayer(userMarker);
    }
    //Reset previous highlighted locations
    _.each(markers._layers, function(x){
        x.setStyle({color:"#489075", fillColor:"#489075"});
    });
    //Add user-defined marker to map
    userMarker = layer;
    map.addLayer(userMarker);
    userMarkerPoint = turf.point([userMarker._latlng.lng,userMarker._latlng.lat]);
    // find nearest five Public Art locations
    var num = $("#input").val();
    findNearestSet(userMarkerPoint,parsed, num);
    //Add shape to sidebar
    $("#shapes").empty();
    NearestSetSidebar(nearestSet);
});

// Make markers of the input dataset
var makeMarkers = function(data){
  return L.geoJson(data,{
    onEachFeature: eachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, markerStlye(feature));
    }
  });
};

// bind popup to circle markers (used in makeMarkers function)
var eachFeature = function(feature, layer){
  layer.bindPopup(feature.properties.Title.replace(/"/g,''));
};

// set marker style (used in makeMarkers function)
var markerStlye = function(feature){
  return{
    color: "#489075",
    fillColor: "#489075",
    opacity:0.5,
    fillOpacity: 0.4
  };
};

// get the dataset using ajax call
$.ajax(data).done(function(data){
  parsed = JSON.parse(data);
  markers = makeMarkers(parsed);
  markers.addTo(map);
});
