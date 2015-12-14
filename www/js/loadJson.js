require.config({
	waitSeconds : 2,
	paths : {
		text : './lib/require/text',
		json : './lib/require/json'
	}
});

function loadJson(path, callback) {
	require(['json!' + path], callback);
}