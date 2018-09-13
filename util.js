var load_text_resource = function (url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url + "?please dont cache=" + Math.random(), true);

	request.onload = function (){

		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP status ' + request.status + ' on resource ' + url + '!!!');
		}else{
			callback(null, request.responseText);
		}
	};
	request.send();
};

var load_image = function (url, callback) {

	var image = new Image();

	image.onload = function (){
		callback(null, image);
	};
	
	image.src = url;
};

var load_json_resource = function (url, callback) {
	load_text_resource(url, function(err, result){
		if (err) {
			callback(err);
		}else{
			try {
				callback(null, JSON.parse(result));
			} catch (e) {
				callback(e);
			}
		}
	});
};