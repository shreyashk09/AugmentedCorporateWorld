ar canvases = document.querySelectorAll('canvas'),
  recordingCtx,
  current = 0,
  chunks = [],
  recorder,
  switchInterval;

// draw one of our canvas on a third one
function recordingAnim() {
  recordingCtx.drawImage(canvases[current], 0, 0);
  // if recorder is stopped, stop the animation
  if (!recorder || recorder.state === 'recording') {
    requestAnimationFrame(recordingAnim);
  }
}

function startRecording() {

  var recordingCanvas = canvases[0].cloneNode();
  recordingCtx = recordingCanvas.getContext('2d');
  recordingCanvas.id = "";
  // chrome forces us to display the canvas in doc so it can be recorded,
  // This bug has been fixed in chrome 58.0.3014.0
  recordingCtx.canvas.style.height = 0;
  document.body.appendChild(recordingCtx.canvas);

  // draw one of the canvases on our recording one
  recordingAnim();

  // init the MediaRecorder
  recorder = new MediaRecorder(recordingCtx.canvas.captureStream(30));
  recorder.ondataavailable = saveChunks;
  recorder.onstop = exportVideo;
  recorder.start();

  stopRec.onclick = stopRecording;
  // switch the canvas to be recorder every 200ms
  switchInterval = setInterval(switchStream, 200);

}

function saveChunks(evt) {
  // store our final video's chunks
  if (evt.data.size > 0) {
    chunks.push(evt.data);
  }

}

function stopRecording() {
    // stop everything, this will trigger recorder.onstop
    recorder.stop();
    clearInterval(switchInterval);
    stopCanvasAnim();
    a.style.display = b.style.display = 'none';
    this.parentNode.innerHTML = "";
    recordingCtx.canvas.parentNode.removeChild(recordingCtx.canvas)
  }
  // when we've got everything

function exportVideo() {
  vid.src = URL.createObjectURL(new Blob(chunks));
}

// switch between 1 and 0
function switchStream() {
    current = +!current;
  }
  // some fancy drawings
var stopCanvasAnim = (function initCanvasDrawing() {

  var aCtx = canvases[0].getContext('2d'),
    bCtx = canvases[1].getContext('2d');

  var objects = [],
    w = canvases[0].width,
    h = canvases[0].height;
  aCtx.fillStyle = bCtx.fillStyle = 'ivory';
  // taken from http://stackoverflow.com/a/23486828/3702797
  for (var i = 0; i < 100; i++) {
    objects.push({
      angle: Math.random() * 360,
      x: 100 + (Math.random() * w / 2),
      y: 100 + (Math.random() * h / 2),
      radius: 10 + (Math.random() * 40),
      speed: 1 + Math.random() * 20
    });
  }
  var stop = false;
  var draw = function() {

    aCtx.fillRect(0, 0, w, h);
    bCtx.fillRect(0, 0, w, h);
    for (var n = 0; n < 100; n++) {
      var entity = objects[n],
        velY = Math.cos(entity.angle * Math.PI / 180) * entity.speed,
        velX = Math.sin(entity.angle * Math.PI / 180) * entity.speed;

      entity.x += velX;
      entity.y -= velY;

      aCtx.drawImage(imgA, entity.x, entity.y, entity.radius, entity.radius);
      bCtx.drawImage(imgB, entity.x, entity.y, entity.radius, entity.radius);

      entity.angle++;
    }
    if (!stop) {
      requestAnimationFrame(draw);
    }
  }


  var imgA = new Image();
  var imgB = new Image();
  imgA.onload = function() {
    draw();
    startRecording();
  };
  imgA.crossOrigin = imgB.crossOrigin = 'anonymous';
  imgA.src = "https://dl.dropboxusercontent.com/s/4e90e48s5vtmfbd/aaa.png";
  imgB.src = "https://dl.dropboxusercontent.com/s/rumlhyme6s5f8pt/ABC.png";

  return function() {
    stop = true;
  };
})();