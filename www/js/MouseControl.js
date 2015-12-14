/**
 * MouseControl
 * very basic class to rotate a THREE.Object3D in a 1st person fashion with the mouse
 *
 *
 * Constructor
 *
 * MouseControl( object, direction )
 * sets the THREE.Object3D
 * (optional) direction: you can restrict the rotation to one axis,
 * by passing one of the values of MouseControlDirection
 *
 *
 * Properties
 *
 * sensitivity
 * sets the sensitivity
 * 1.0 by default
 * 
 *
 * Methods
 *
 * connect() 
 * listen to the mouse events
 *
 * update()
 * rotate the object
 *
 * disconnect()
 * remove the listeners
 */
//

MouseControlDirection = {
	HORIZONTAL: 1,
	VERTICAL: 2
};

MouseControl = function(object, direction) {
	var that = this;

	var minX = -Math.PI / 2;
	var maxX = Math.PI / 2;

	var x, y;

	var enabled = false;

	var mouse;

	this.sensitivity = 1;
	this.object = object;

	if (direction !== undefined) {
		this.horizontal = direction & MouseControlDirection.HORIZONTAL;
		this.vertical = direction & MouseControlDirection.VERTICAL;
	} else {
		this.horizontal = true;
		this.vertical = true;
	}

	this.onMouseMove = function(event) {
		if (!enabled) {
			x = event.clientX;
			y = event.clientY;
		}
		enabled = true;
		mouse = event;
	}

	this.update = function() {
		if (enabled) {
			if (that.horizontal)
				that.object.rotation.y -= (mouse.clientX - x) / 100 * that.sensitivity;
			if (that.vertical) {
				that.object.rotation.x -= (mouse.clientY - y) / 100 * that.sensitivity;
        if (that.object.rotation.x < minX)
          that.object.rotation.x = minX;
        if (that.object.rotation.x > maxX)
          that.object.rotation.x = maxX;
      }
      x = mouse.clientX;
      y = mouse.clientY;
    }
  }

  this.connect = function() {
    document.addEventListener('mousemove', this.onMouseMove);
  }

  this.disconnect = function() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}