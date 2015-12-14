var Scene = function(element, json) {
  var that = this;

  this.updateFctns = [];

  this.clock = new THREE.Clock();
  this.geoConverter = new Math.GeoToCoordsConverter(43.7141516, 7.2889739);

  this.renderer = new THREE.WebGLRenderer({alpha: true});

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor(0x9999cf, 0.1);
  element[0].appendChild(this.renderer.domElement);

  this.camera = new THREE.PerspectiveCamera(80,
    window.innerWidth / window.innerHeight, 0.1, 100000);
  this.cameraBody = new THREE.Object3D();
  this.cameraBody.add(this.camera);

  that.init = function() {

    var objLoader = new ObjectLoaderAM(that.onUpdate);

    objLoader.onAdd = function (obj) {

      if (obj.userData !== undefined && obj.position !== undefined) {
        var data = obj.userData;

        if (data.latitude !== undefined && data.longitude !== undefined) {
          obj.position.copy(that.geoConverter.getCoords(data.latitude, data.longitude));
        }
        if (data.altitude !== undefined) {
          obj.position.y = data.altitude;
        }
      }
    };

    that.tscene = objLoader.parse(json);

    that.tscene.add(that.cameraBody);

    window.addEventListener('resize', onWindowResize, false);
  };

  this.onUpdate = function(fctn) {
    that.updateFctns.push(fctn);
  }

  this.render = function() {
    that.renderer.render(that.tscene, that.camera);
  };

  this.loop = function() {
    requestAnimationFrame(that.loop);
    that.update();
    that.render();
  };

  this.update = function() {
    for (i = 0, c = that.updateFctns.length; i < c; ++i) {
      that.updateFctns[i]();
    }
    THREE.AnimationHandler.update(that.clock.getDelta());
  };

  this.addObject = function(object) {
    that.tscene.add(object);
  };

  function onWindowResize() {
    that.camera.aspect = window.innerWidth / window.innerHeight;
    that.camera.updateProjectionMatrix();

    that.renderer.setSize(window.innerWidth, window.innerHeight);
  }
};