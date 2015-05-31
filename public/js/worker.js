importScripts();
onmessage = function(e) {
  var data = e.data;
  postMessage(data);
}
