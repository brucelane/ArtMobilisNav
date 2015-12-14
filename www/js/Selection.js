Selection = function(scene, camera) {
	var that = this;

	this.scene = scene;
	this.camera = camera;
	this.previous = null;
	this.target = null;

	function raycast(point) {
		var raycaster = new THREE.Raycaster();

		raycaster.setFromCamera(point, that.camera);
		var intersects = raycaster.intersectObjects(that.scene.children);

		if (intersects.length > 0)
			return intersects[0].object;
		else
			return null;
	}

	function setSelection(object) {
		that.previous = that.target;
		that.target = object;
	}

	// return true if that.selection changed
	this.set = function(point) {
		var object;

		object = raycast(point);

		if (object == null || object != that.selection) {
			setSelection(object);
			return true;
		}
		else
			return false;
	}

	this.reset = function() {
		setSelection(null);
	}
}