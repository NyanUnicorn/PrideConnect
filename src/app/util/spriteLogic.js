// Define the size of a frame
let frameWidth = 75;
let frameHeight = 97;
let beginX = 147;
let beginY = 96;

let frameOffset = 1017;

let playerImageIdOffsetX = [0, 110];

let playerLeftOffsetX = [[0, -3, 0, 10]];
let playerLeftOffsetY = [[0, -5, -5, -5]];

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
      horizontalOffset = 549;
      break;
    case 'down':
      horizontalOffset = 277;
      break;
  }
  if(dir === 'left') {
    horizontalFrameOffset = playerLeftOffsetX[playerImageId][currentFrame];
    verticalFrameOffset = playerLeftOffsetY[playerImageId][currentFrame]
  }
  context.drawImage(playerImage, beginX + frameOffset * currentFrame + horizontalOffset + horizontalFrameOffset + playerImageIdOffsetX[playerImageId], beginY + verticalFrameOffset, frameWidth, frameHeight, x, y, width, height); 
};

export { drawPlayer };
