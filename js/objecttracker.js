let topcodes = [];

// register a callback function with the TopCode library
TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {

  // convert the JSON string to an object
  var json = JSON.parse(jsonString);

  // get the list of topcodes from the JSON object
  topcodes = json.topcodes;

  // obtain a drawing context from the <canvas>
  var ctx = document.querySelector("#video-canvas").getContext('2d');

  // draw a circle over the top of each TopCode
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";   // very translucent red
  for (i = 0; i < topcodes.length; i++) {
    // console.log(`TopCode Radius: ${topcodes[i].radius}, TopCode Code: ${topcodes[i].code}`);
    // console.log(`TopCode X: ${topcodes[i].x}, TopCode Y: ${topcodes[i].y}`);
    ctx.beginPath();
    ctx.arc(topcodes[i].x, topcodes[i].y, topcodes[i].radius, 0, Math.PI*2, true);
    ctx.fill();
  }
});

function getTopCodes() {
  return topcodes;
}
