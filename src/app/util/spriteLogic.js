// Define the size of a frame
let frameWidth = 63;
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

const drawPlayer = (context, canvas, playerImageId, currentFrame, x, y, width, height) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(context, canvas);
  switch(playerImageId) {
    case 0:
      context.drawImage(playerImage, beginX + frameOffset * currentFrame, beginY, frameWidth, frameHeight, x, y, width, height);
      break;
    case 1:
      context.drawImage(playerImage, beginX + frameOffset * currentFrame, beginY, frameWidth, frameHeight, x, y, width, height);
      break;
  }
  
};

export { drawPlayer };