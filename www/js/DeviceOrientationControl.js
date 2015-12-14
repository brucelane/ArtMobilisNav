/**
 * DeviceOrientationControl
 * orient a THREE.Object3D using the gyroscope
 *
 *
 * Constructor
 *
 * DeviceOrientationControl( object )
 * sets the THREE.Object3D to rotate
 *
 *
 * Methods
 *
 * connect() 
 * listen to the orientation events
 *
 * update()
 * sets the rotation of the object accordingly to the last orientation event
 *
 * disconnect()
 * remove the listeners
 */
//

DeviceOrientationControl = function(object) {
	var that = this;

	var mod_2pi = function () {
		var n = Math.PI;
		var k = Math.PI * 2;

		return function(val) {
			if (val > n) {
				do {
					val -= k;
				} while (val > n);
			}
			else if (val < -n) {
				do {
					val += k;
				} while (val < -n);
			}
			return val;
		}
	}();

	var mod_360 = function(val) {
		val = val % 360;
		return (val < 180) ? val : val - 360;
	};

  var CoefMethod = function() {
    var that = this;

    this.coef = 0.1;

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    this.event = false;

    this.onOrientationChange = function(e) {
      that.event = e;
    }

    this.update = function() {
      if (that.event) {
        var alpha = that.alpha + mod_2pi(Math.degToRad(that.event.alpha) - that.alpha) * that.coef;
        var beta = that.beta + mod_2pi(Math.degToRad(that.event.beta) - that.beta) * that.coef;
        var gamma = that.gamma + mod_2pi(Math.degToRad(that.event.gamma) - that.gamma) * that.coef;

        that.alpha = alpha;
        that.beta = beta;
        that.gamma = gamma;
      }
    }
  };

  var AverageMethod = function() {
    var that = this;

    this.history = [];
    this.historyMax = 10;

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    this.onOrientationChange = function(event) {
      if (that.history.length > that.historyMax)
        that.history.shift();
      that.history.push(event);
    };

    this.update = function(alpha, beta, gamma) {
      var alpha = 0;
      var beta = 0;
      var gamma = 0;

      if (that.history.length != 0) {
        for (var i = 0, c = that.history.length; i < c; i++) {
          alpha += mod_360(that.history[i].alpha);
          beta += mod_360(that.history[i].beta);
          gamma += mod_360(that.history[i].gamma);
        }
        alpha /= that.history.length;
        beta /= that.history.length;
        gamma /= that.history.length;
        that.alpha = Math.degToRad(alpha);
        that.beta = Math.degToRad(beta);
        that.gamma = Math.degToRad(gamma);
      }
    };
    
  };


  this.object = object;
  this.object.rotation.reorder("YXZ");

  enabled = false;

  screenOrientation = 0;

  smooth = new CoefMethod();


  var onDeviceOrientationChangeEvent = function (event) {
    smooth.onOrientationChange(event);
    enabled = true;
  };

  var onScreenOrientationChangeEvent = function () {
    screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''


  this.connect = function() {
    onScreenOrientationChangeEvent();

    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
  };

  this.disconnect = function() {
    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

    enabled = false;
  };

  this.update = function () {

    var setObjectQuaternion = function () {
      var zee = new THREE.Vector3( 0, 0, 1 );
      var euler = new THREE.Euler();
      var q0 = new THREE.Quaternion();
      var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

      return function (quaternion, alpha, beta, gamma, orient) {
        euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us
        quaternion.setFromEuler( euler );                               // orient the device
        quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top
        quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation
      }
    }();

    if (enabled) {
     var orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0;

     smooth.update();

     setObjectQuaternion(that.object.quaternion, smooth.alpha, smooth.beta, smooth.gamma, orient);

   }
  };
};
