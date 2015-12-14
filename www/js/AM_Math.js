Math.GeoToCoordsConverter = function(latitude_orig, longitude_orig) {

  var EARTH_RADIUS = 6371000;

	var that = this;

  var lat_orig = THREE.Math.degToRad(latitude_orig);
	var long_orig = THREE.Math.degToRad(longitude_orig);

	this.getCoords = function(latitude, longitude) {
		var lat = THREE.Math.degToRad(latitude);
		var long = THREE.Math.degToRad(longitude);
		var medium_lat = (lat_orig + lat) / 2;
		var vec = new THREE.Vector3();

		vec.x = (long - long_orig) * EARTH_RADIUS * Math.cos(medium_lat);
		vec.z = (lat - lat_orig) * -EARTH_RADIUS;

		return vec;
	};
};

Math.degToRad = function() {
  var k = Math.PI / 180;

  return function(deg) {
    return deg * k;
  };
}();

Math.clamp = function(value, min, max) {
	if (value < min)
		return min;
	if (value > max)
		return max;
	return value;
};