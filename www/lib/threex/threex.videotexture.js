// edited for ArtMobilis

var THREEx = THREEx || {}

THREEx.VideoTexture	= function(url){
	// create the video element
	var video	= document.createElement('video');
	video.width	= width;
	video.height	= 320;
	video.autoplay	= 240;
	video.loop	= true;
	video.src	= url;
	// expose video as this.video
	this.video	= video

	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture

	/**
	 * update the object
	 */
	this.update	= function(){
		if ( video.readyState !== video.HAVE_ENOUGH_DATA ) return;
		texture.needsUpdate	= true;
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause()
	}
}

THREEx.Video = function(url, uuid) {
	this.uuid = uuid;
	this.url = url;
	this.width = 320;
	this.height = 240;
}