/**
 * DeviceCamera
 *
 * Class wrapper for the 'camera preview' Cordova plugin
 * Listen to the 'deviceready' event, then you can use this class
 *
 * document.addEventListener('deviceready', function() {
 *    deviceCamera = new DeviceCamera();
 *    deviceCamera.start();
 * }, false);
 *
 *
 * Dependency:
 * Camera Preview: https://github.com/mbppower/CordovaCameraPreview
 *
 */
// 

var DeviceCamera = function() {
  var that = this;

	this.tapEnabled = false; //enable tap take picture
	this.dragEnabled = false; //enable preview box drag across the screen
	this.toBack = true; //send preview box to the back of the webview
	this.rect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
	this.frontCam = false;

	this.start = function() {
		window.cordova.plugins.camerapreview.startCamera(
			that.rect,
			that.frontCam ? "front" : "back",
			that.tapEnabled,
			that.dragEnabled,
			that.toBack
			);
	};

	this.stop = function() {
		window.cordova.plugins.camerapreview.stopCamera();
	};

	this.takePicture = function(width, height) {
		window.cordova.plugins.camerapreview.takePicture({maxWidth:width, maxHeight:height});
	};

	this.switchCamera = function() {
		window.cordova.plugins.camerapreview.switchCamera();
	};

	this.show = function() {
		window.cordova.plugins.camerapreview.show();
	};

	this.hide = function() {
		window.cordova.plugins.camerapreview.hide();
	};
};