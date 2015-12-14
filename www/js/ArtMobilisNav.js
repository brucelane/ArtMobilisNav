ArtMobilisNav = function(element, isWebView) {
	var that = this;

	var scene;

	var orientationControls;
	var geolocationControls;
	var mouseControlBody;
	var mouseControlCam;
	var keyboardControl;

  this.isWebView = isWebView;

	function initEventListeners(scene) {
		document.addEventListener("deviceready", function() {
			if (window.cordova) {
				if (window.screen.lockOrientation)
					window.screen.lockOrientation('portrait-primary');
			}
		}, false);

	}

	this.run = function() {

		loadJson('./assets/scenes/scene.json', function(data) {
			scene = new Scene(element, data);
			scene.init();

      if (that.isWebView) {

        orientationControl = new DeviceOrientationControl(scene.camera);
        geolocationControl = new GeolocationControl(scene.cameraBody, scene.geoConverter);

        initEventListeners(scene);

        orientationControl.connect();
        geolocationControl.connect();
        
        scene.onUpdate(orientationControl.update);
        scene.onUpdate(geolocationControl.update);

      }
      else {

        mouseControlBody = new MouseControl(scene.cameraBody,
          MouseControlDirection.HORIZONTAL);
        mouseControlCam = new MouseControl(scene.camera,
          MouseControlDirection.VERTICAL);
        keyboardControl = new KeyboardControl(scene.cameraBody);

        mouseControlBody.connect();
        mouseControlCam.connect();
        keyboardControl.connect();

        scene.onUpdate( function() {
          mouseControlBody.update();
          mouseControlCam.update();
          keyboardControl.update();

        });
      }

      scene.loop();

    });
	}
}