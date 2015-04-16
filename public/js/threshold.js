onmessage = function(e) {
  var data = threshold(e.data.args[0], e.data.args[1]);
  postMessage(data);
}


var threshold = function(pixels, threshold) {
	var d = pixels.data;
  	for (var i=0; i<d.length; i+=4) {
    	var r = d[i];
    	var g = d[i+1];
    	var b = d[i+2];
    	var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    	d[i] = d[i+1] = d[i+2] = v
  	}
  	return pixels;
};
