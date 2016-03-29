/* =====================
Lab 1: Turf.js

"Our maps have only interpreted data in various ways; the point is to change it."


In the coming weeks, we'll be looking at ways to explore, analyze, and create data.
This will require us to build upon concepts that we've already mastered. Turf.js is a
javascript library which provides some excellent utilities for fast, in-browser
spatial analysis.

Recall that GeoJSON is a format for representing spatial objects in JSON. It encodes
not only the geometric entities themselves (Points, Lines, Polygons) but also associated
properties (these are the properties of Features) and collections thereof (FeatureGroups).

This is useful for sending spatial data over the wire (we can present these objects in text
since they are JSON). But the predictable structure of a geojson object (there are
infinitely many possible geojson objects, though they all meet the criteria specified
here: http://geojson.org/) also benefits us by offering a structure which our code can
expect.

Consider the functions you've written before: their input has depended on the type
of data they receive. If you write a function which expects an object that has an 'x' and
a 'y' property, you can access those within your function body:

function exampleFunction(someObject) {
  return someObject.x + someObject.y;
}
exampleFunction({x: 1, y: 22}) === 23

Turf leans on the predictable structure of geojson to provide its analytic functions.
Here, Turf lays out the types you can expect to find throughout its documentation:
http://turfjs.org/static/docs/global.html

Let's look to a turf function's docs: http://turfjs.org/static/docs/module-turf_average.html
==================================================================================================
name              - Type                        - Description
==================================================================================================
polygons          - FeatureCollection.<Polygon> - polygons with values on which to average
points            - FeatureCollection.<Point>   - points from which to calculate they average
field             - String                      - the field in the points features from which to
                                                  pull values to average
outputField       - String                      - the field in polygons to put results of the averages
==================================================================================================
Returns           - FeatureCollection.<Polygon> - polygons with the value of outField set to
                                                  the calculated averages
==================================================================================================

What this tells us is that turf.average takes four arguments. The first
argument is a FeatureCollection of Polygons, the second, is a FeatureCollection
of Points, the third and fourth is a bit of text.

With those inputs, a FeatureCollection of polygons is produced which has the average value
of "field" from the points (captured within a spatial join) stored on its properties' field
"outputField".

All of the functionality within turf can be similarly understood by looking to its documentation.
Turf documentation: http://turfjs.org/static/docs/
Turf examples: http://turfjs.org/examples.html


Each exercise in this lab involves the creation of GeoJSON (feel free to use geojson.io) and
the use of that GeoJSON in some turf functions.

NOTE: you can use geojson.io's table view to attach properties to your geometries!

Exercise 1: Finding the nearest point
Take a look at http://turfjs.org/static/docs/module-turf_nearest.html
Produce a Feature and a FeatureCollection (look to the in-documentation examples if this is
unclear) such that the single Point Feature is in Philadelphia and the nearest point in the
FeatureCollection (there should be at least two other points in this collection) happens
to be in New York City. Plot the NYC point and no others with the use of turf.nearest.


Exercise 2: Finding the average point value (a form of spatial join)
Docs here: http://turfjs.org/static/docs/module-turf_average.html
Produce one FeatureCollection of points (at least 5) and one of polygons (at least 2)
such that, by applying turf.average, you generate a new set of polygons in which one of
the polygons has the property "averageValue" with a value of 100.


Exercise 3: Tagging points according to their locations
http://turfjs.org/static/docs/module-turf_tag.html
It can be quite useful to 'tag' points in terms of their being within this or that
polygon. You might, for instance, want to color markers which represent dumpsters
according to the day that trash is picked up in that area. Create three polygons
and use properties on those polygons to color 5 points.


*STRETCH GOAL*
Exercise 4: Calculating a destination
A species of bird we're studying is said to travel in a straight line for 500km
during a migration before needing to rest. One bird in a flock we want to track
has a GPS tag which seems to be on the fritz. We know for a fact that it started
flying from [-87.4072265625, 38.376115424036016] and that its last known coordinate
was [-87.5830078125, 38.23818011979866]. Given this information, see if you can
determine where we can expect this flock of birds to rest.
===================== */

var plotFeature = function(feature){
      feature.addTo(map);
    };
var removeFeature = function(feature) {
      map.removeLayer(feature);
    };

//Exercise 1: Finding the nearest point
var point = {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.19266128540039,39.95223725519684]}};
var against = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-73.99764060974121,40.73093368341445]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-71.06244564056396,42.35649846054638]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-80.01274108886719,40.44181942030455]}}]};
var nearest = turf.nearest(point, against);
var nearest_marker = L.marker([nearest.geometry.coordinates[1],nearest.geometry.coordinates[0]]);
plotFeature(nearest_marker);
removeFeature(nearest_marker);

//Exercise 2: Finding the average point value (a form of spatial join)
var points = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"value":10},"geometry":{"type":"Point","coordinates":[-75.20193099975586,39.953109047840236]}},{"type":"Feature","properties":{"value":20},"geometry":{"type":"Point","coordinates":[-75.19540786743163,39.947779424806214]}},{"type":"Feature","properties":{"value":30},"geometry":{"type":"Point","coordinates":[-75.18879890441895,39.95370120254379]}},{"type":"Feature","properties":{"value":90},"geometry":{"type":"Point","coordinates":[-75.17060279846191,39.95205631570857]}},{"type":"Feature","properties":{"value":100},"geometry":{"type":"Point","coordinates":[-75.15772819519043,39.95350381821224]}},{"type":"Feature","properties":{"value":110},"geometry":{"type":"Point","coordinates":[-75.16528129577637,39.94106745695668]}}]};
var polygons = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-75.20939826965332,39.942515191991696],[-75.20939826965332,39.95889878493113],[-75.18038749694824,39.95889878493113],[-75.18038749694824,39.942515191991696],[-75.20939826965332,39.942515191991696]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-75.17532348632812,39.93678987904212],[-75.17532348632812,39.95909615369219],[-75.15232086181639,39.95909615369219],[-75.15232086181639,39.93678987904212],[-75.17532348632812,39.93678987904212]]]}}]};
var averaged = turf.average(polygons, points, 'value', 'averageValue');
var averaged_polygons = L.geoJson(averaged);
plotFeature(averaged_polygons);
removeFeature(averaged_polygons);

//Exercise 3: Tagging points according to their locations
points = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.20098686218262,39.95278007078964]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.19180297851561,39.94705561681295]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.18751144409178,39.952648479526374]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.16365051269531,39.950871972692845]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-75.17532348632812,39.9295502919]}}]};
polygons = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"polygon_color":"#ff0000"},"geometry":{"type":"Polygon","coordinates":[[[-75.20776748657227,39.94284421840946],[-75.20776748657227,39.95758297863267],[-75.18184661865234,39.95758297863267],[-75.18184661865234,39.94284421840946],[-75.20776748657227,39.94284421840946]]]}},{"type":"Feature","properties":{"polygon_color":"#00ff00"},"geometry":{"type":"Polygon","coordinates":[[[-75.1765251159668,39.94297582853355],[-75.1765251159668,39.958109304190224],[-75.15000343322754,39.958109304190224],[-75.15000343322754,39.94297582853355],[-75.1765251159668,39.94297582853355]]]}},{"type":"Feature","properties":{"polygon_color":"#0000ff"},"geometry":{"type":"Polygon","coordinates":[[[-75.18785476684569,39.92224411411874],[-75.18785476684569,39.93718474358997],[-75.15995979309082,39.93718474358997],[-75.15995979309082,39.92224411411874],[-75.18785476684569,39.92224411411874]]]}}]};
var tagged = turf.tag(points, polygons,'polygon_color', 'points_color');

var markerStlye = function(feature){
  return{
    color: feature.properties.points_color,
    fillColor: feature.properties.points_color,
  };
};
var tagged_points = L.geoJson(tagged,{
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, markerStlye(feature));
  }
});
plotFeature(tagged_points);
removeFeature(tagged_points);

//Exercise 4: Calculating a destination
