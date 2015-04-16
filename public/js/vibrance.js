onmessage = function(e) {
  var data = vibrance(e.data.args[0], e.data.args[1]);
  postMessage(data);
}


var vibrance = function(pixels, adjustment) {
	var d = pixels.data;
  	adjustment *= -1
  	for (var i=0; i<d.length; i+=4) {
	    var r = d[i];
	    var g = d[i+1];
	    var b = d[i+2];
	    var max = Math.max(r, g, b);
	    var avg = (r + g + b) / 3;
	    var amt = ((Math.abs(max - avg) * 2 / 255) * adjustment) / 100;
	    if(r != max) d[i] = (max - r) * amt;
	    if(g != max) d[i+1] = (max - g) * amt;
	    if(b != max) d[i+2] = (max - b) * amt;
  	}
  	return pixels;
};
