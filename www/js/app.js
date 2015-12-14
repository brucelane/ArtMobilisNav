// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

angular.module('starter').directive('threeJsCanvas', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attr) {

      var audio = document.createElement('audio');
      document.body.appendChild(audio);
      audio.src = 'assets/sounds/laugh.wav';
      audio.play();


      var isWebView = ionic.Platform.isWebView();

      if (isWebView) {
        ionic.Platform.ready(function(){

          var am = new ArtMobilisNav(element, isWebView);

          am.run();

        });
      }
      else {

          var am = new ArtMobilisNav(element, isWebView);

          am.run();

      }
    }
  }
})

.directive('deviceCameraCanvas', function() {
  return {
    restrict: 'E',
    link: function (scope, element, attr) {
      document.addEventListener("deviceready", function() {

        var deviceCamera = new DeviceCamera();
        deviceCamera.rect = {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight};

        deviceCamera.start();

      }, false);
    }
  }
})