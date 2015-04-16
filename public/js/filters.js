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
		var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		d[i] = d[i+1] = d[i+2] = v;
	}
	return pixels;
};

Filters.brightness = function(pixels, adjustment) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
  return pixels;
};

Filters.threshold = function(pixels, threshold) {
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
 
Filters.vibrance = function(pixels, adjustment) {
  var d = pixels.data;
  adjustment *= -1
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var max = Math.max(r, g, b);
    var avg = (r + g + b) / 3;
    var amt = ((Math.abs(max - avg) * 2 / 255) * adjustment) / 100;
    if(r != max) d[i] = (max - r) * amt
    if(g != max) d[i+1] = (max - g) * amt
    if(b != max) d[i+2] = (max - b) * amt
  }
  return pixels;
};

Filters.prototype.runFilters = function() {
  var d1 = new Date();
  var grayScaleWorker = new Worker('/public/js/grayScale.js');
  var brightnessWorker = new Worker('/public/js/brightness.js');
  var thresholdWorker = new Worker('/public/js/threshold.js');
  var vibranceWorker = new Worker('/public/js/vibrance.js');

  var args = [Filters.getPixels(img)];
  grayScaleWorker.postMessage({
    args : args
  });
  args.pop();
  grayScaleWorker.onmessage = function(e) {
    Filters.drawImage("grayScale", e.data);
  }

  args.push(Filters.getPixels(img));
  args.push(75);
  brightnessWorker.postMessage({
    args : args
  });
  args.pop();
  args.pop();
  brightnessWorker.onmessage = function(e) {
    Filters.drawImage("brightness", e.data);
  }

  args.push(Filters.getPixels(img));
  args.push(100);
  thresholdWorker.postMessage({
    args : args
  });
  args.pop();
  args.pop();
  thresholdWorker.onmessage = function(e) {
    Filters.drawImage("threshold", e.data);
  }

  args.push(Filters.getPixels(img));
  args.push(50);
  vibranceWorker.postMessage({
    args : args
  });
  args.pop();
  args.pop();
  vibranceWorker.onmessage = function(e) {
    Filters.drawImage("vibrance", e.data);
  }

  var d2 = new Date();
  alert((d2 - d1) / 1000);
  
	
  
  /*var data = Filters.grayScale.apply(null, args);
  Filters.drawImage("grayScale", data);
    args.pop();


  args.push(Filters.getPixels(img));
  args.push(75);
  data = Filters.threshold.apply(null, args);
  Filters.drawImage("threshold", data);
  args.pop();
  args.pop();

  args.push(Filters.getPixels(img));
  args.push(100);
  data = Filters.brightness.apply(null, args);
  Filters.drawImage("brightness", data);
  args.pop();
  args.pop();

  args.push(Filters.getPixels(img));
  args.push(50);
  data = Filters.vibrance.apply(null, args);
  Filters.drawImage("vibrance", data);
  args.pop();
  args.pop();*/
  
}

Filters.drawImage = function(id, data) {
  var c = document.getElementById(id);
  c.width = data.width;
  c.height = data.height;
  var ctx = c.getContext('2d');
  ctx.putImageData(data, 0, 0);
  c.style.display = 'inline';
}
