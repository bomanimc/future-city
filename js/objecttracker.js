let topCodesList = new TopCodesList([]);

// register a callback function with the TopCode library
TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {

  // convert the JSON string to an object
  var json = JSON.parse(jsonString);

  // get the list of topcodes from the JSON object and make a new class instance
  topCodesList.setTopCodes(json.topcodes);
  const tCodes = topCodesList.getTopCodes();

  // obtain a drawing context from the <canvas>
  var ctx = document.querySelector("#video-canvas").getContext('2d');

  // draw a circle over the top of each TopCode
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";   // very translucent red
  for (i = 0; i < tCodes.length; i++) {
    ctx.beginPath();
    ctx.arc(tCodes[i].x, tCodes[i].y, tCodes[i].radius, 0, Math.PI*2, true);
    ctx.fill();
  }
});

function getTopCodesList() {
  return topCodesList;
}
