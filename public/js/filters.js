var Filters = function(img) {
  this.img = img;
};

Filters.getPixels = function(img) {
	var c = document.createElement('canvas');
  	c.width = img.width;
  	c.height = img.height;
	var ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0,0,c.width,c.height);
};

Filters.grayScale = function(pixels) {
	var d = pixels.data;
	for (var i=0; i<d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		var v = 0.2126*r + 0.7152*g + 0.0722*b;
		d[i] = d[i+1] = d[i+2] = v;
	}
	return pixels;
};

Filters.filterImage = function(img) {
  var args = [Filters.getPixels(img)];
  return Filters.grayScale.apply(null, args);
};

Filters.prototype.runFilter = function(id) {
	var idata = Filters.filterImage(this.img);
	var c = document.getElementById(id);
	c.width = idata.width;
	c.height = idata.height;
	var ctx = c.getContext('2d');
	ctx.putImageData(idata, 0, 0);
	c.style.display = 'inline';
}
