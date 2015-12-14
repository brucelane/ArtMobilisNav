/**
 * GeolocationControl
 * place a THREE.Object3D using the gyroscope
 *
 *
 * Constructor
 *
 * GeolocationControl( object, geoConverter )
 * sets the THREE.Object3D to move, and the Math.GeoToCoordsConverter
 * to convert GPS coordinates to flat coordinates
 *
 *
 * Methods
 *
 * connect() 
 * listen to the geolocation events
 *
 * update()
 * move smoothly the object towards the last known position
 *
 * disconnect()
 * remove the listeners
 *
 *
 * Dependency
 *
 * AM_Math.js
 * Cordova Plugin geolocation: https://github.com/apache/cordova-plugin-geolocation
 */
//

GeolocationControl = function(object, geoConverter) {

	var that = this;

	var enabled =  false;

	var toUpdate = false;
	var object = object;
	var position = new THREE.Vector3();
	var watchId = 0;
	var converter = geoConverter;

	this.coef = 0.02;
	this.accuracy = 1;
  this.retryConnectionMs = 1000;

	function onSuccess(pos) {
		enabled = true;
		position.copy(converter.getCoords(pos.coords.latitude, pos.coords.longitude));
		toUpdate = true;
	}

	function onError(error) {
		console.warn('geolocation failed: ' + error.message);
    window.setTimeout(that.connect, that.retryConnectionMs);
	}

	this.connect = function() {
		that.watchId = navigator.geolocation.watchPosition(onSuccess, onError);
	};

	this.disconnect = function() {
		navigator.geolocation.clearWatch(that.watchId);
	};

	this.update = function() {
		if (enabled && toUpdate) {

			var diffX = position.x - object.position.x;
			var diffZ = position.z - object.position.z;

			if (Math.abs(diffX) < that.accuracy && Math.abs(diffZ) < that.accuracy) {
				toUpdate = false;
			}
			else {
				diffX *= that.coef;
				diffZ *= that.coef;
				object.position.x += diffX;
				object.position.z += diffZ;
			}
		}

	};

};