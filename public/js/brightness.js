onmessage = function(e) {
  var data = brightness(e.data.args[0], e.data.args[1]);
  postMessage(data);
}


var brightness = function(pixels, adjustment) {
	var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
  return pixels;
};
