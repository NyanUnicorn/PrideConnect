// Define the size of a frame
let frameWidth = 65;
let frameHeight = 97;
let beginX = 147;
let beginY = 96;

let frameOffset = 1017;

let playerImageIdOffsetX = 0;
let playerImageIdOffsetY = 0;

const playerImage = new Image();
playerImage.src = "/sprites-sheet.png";

const background = new Image();
background.src = "/grass.png";

const drawBackground = (context, canvas) => {
  if(background.complete) { // Ensure the image has been loaded
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
}

const drawPlayer = (context, canvas, playerImageId, dir, currentFrame, x, y, width, height) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(context, canvas);
  let horizontalOffset = 0;
  let horizontalFrameOffset = 0;
  let verticalOffset = 0;
  let verticalFrameOffset = 0;
  switch(dir) {
    case 'left':
      horizontalOffset = 757;
      break;
    case 'right':
      horizontalOffset = 0;
      break;
    case 'up':
      verticalOffset = 0;
      break;
    case 'down':
      verticalOffset = 0;
      break;
  }
  if(dir === 'left') {
    switch(currentFrame) {
      case 0:
        horizontalFrameOffset = 0;
        verticalFrameOffset = 0;
        break;
      case 1:
        horizontalFrameOffset = 0;
        verticalFrameOffset = -5;
        break;
      case 2:
        horizontalFrameOffset = 0;
        verticalFrameOffset = -5;
        break;
      case 3:
        horizontalFrameOffset = 10;
        verticalFrameOffset = -5;
        break;
    }
  }
  switch(playerImageId) {
    case 0:
      context.drawImage(playerImage, beginX + frameOffset * currentFrame + horizontalOffset + horizontalFrameOffset, beginY + verticalFrameOffset, frameWidth, frameHeight, x, y, width, height);
      break;
    case 1:
      context.drawImage(playerImage, beginX + frameOffset * currentFrame, beginY, frameWidth, frameHeight, x, y, width, height);
      break;
  }
  
};

export { drawPlayer };
