let isGameStarted = false;
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
context.font = 'bold 30px ribeye';
let scrollCounter, cameraY, current, mode, xPos;
let ySpeed = 5;
let height = 50;
let boxes = [];
let i = 0
let colors = ['red', 'blue', 'green', 'orange']
boxes[0] = {
  x: 300,
  y: 300,
  width: 200
};
let debris = {
  x: 0,
  width: 0
};

//Initialized

function newBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * height,
    width: boxes[current - 1].width
  };
}

function gameOver() {
  mode = 'gameOver';
  context.fillText('Game over. Press Spacebar to play again!', 50, 50);
}

function animate() {
  if (mode != 'gameOver') {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText('Score: ' + (current - 1).toString(), 50, 200);
    for (let n = 0; n < boxes.length; n++) {
      let box = boxes[n];
      context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
      context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
    }
    context.fillStyle = 'red';
    context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);
    if (mode == 'bounce') {
      boxes[current].x = boxes[current].x + xPos;
      // Reverse
      if (xPos > 0 && boxes[current].x + boxes[current].width > canvas.width)
        //right
        xPos = -xPos;
      if (xPos < 0 && boxes[current].x < 0)
      //left
        xPos = -xPos;
    }
    if (mode == 'fall') {
      boxes[current].y = boxes[current].y - ySpeed;
      if (boxes[current].y == boxes[current - 1].y + height) {
        mode = 'bounce';
        let difference = boxes[current].x - boxes[current - 1].x;
        if (Math.abs(difference) >= boxes[current].width) {
          gameOver();
        }
        debris = {
          y: boxes[current].y,
          width: difference
        };
        //right debris cut off
        if (boxes[current].x > boxes[current - 1].x) {
          boxes[current].width = boxes[current].width - difference;
          debris.x = boxes[current].x + boxes[current].width;
        } 
        //left debris cut off
        else {
          debris.x = boxes[current].x - difference;
          boxes[current].width = boxes[current].width + difference;
          boxes[current].x = boxes[current - 1].x;
        }
        if (xPos > 0)
          xPos+=2;
        else
          xPos-=2;
        current++;
        scrollCounter = height;
        newBox();
      }
    }
    debris.y = debris.y - ySpeed;
    //stack going down
    if (scrollCounter) {
      cameraY++;
      scrollCounter--;
    }
  }
  //game loop
  window.requestAnimationFrame(animate);
}

function restart() {
  boxes.splice(1, boxes.length - 1);
  mode = 'bounce';
  cameraY = 0;
  scrollCounter = 0;
  xPos = 5;
  current = 1;
  newBox();
  debris.y = 0;
}

document.addEventListener('keydown', function (event) {
  if (event.key === ' ') {
    event.preventDefault();
    i++
    if(i>3){
      i=0
    }
    canvas.style.filter = `drop-shadow(0 0 20px ${colors[i]})`
    if (mode == 'gameOver') {
      restart();
    } else if (mode == 'bounce') {
      mode = 'fall';
    }
  }
});
canvas.addEventListener('touchstart', function (event) {
  event.preventDefault();
  if (mode == 'gameOver' || !isGameStarted) {
    restart();
    isGameStarted = true;
  } else if (mode == 'bounce') {
    mode = 'fall';
  }
});

restart();
animate()