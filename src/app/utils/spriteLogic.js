const frameWidth = 96;
const frameHeight = 97;
const beginX = 135;
const beginY = 96;
const frameOffset = 1017;

const playerImageIdOffsetX = [0, 110];
const playerImageIdOffsetY = [0, 0, 134, 134, 268, 268, 396, 396, 530, 530];

const playerLeftOffsetX = [
  [0, -3, 0, 10],
  [-5, 6, 0, -6],
  [0, 0, 0, 8],
  [0, 4, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 0, 16],
  [6, 16, 0, 6],
];

const playerLeftOffsetY = [
  [0, -5, -5, -5],
  [0, -8, 0, -2],
  [0, 0, -4, 0],
  [0, -4, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const playerImage = new Image();
playerImage.src = "/sprites-sheet.png";

const background = new Image();
background.src = "/grass.png";

const prejudice = new Image();
prejudice.src = "/ghoul_360.png";

const drawPrejudice = (context, currentFrame, x, y, dx, dy) => {
  if(prejudice.complete) {
    context.drawImage(prejudice, x, y, dx, dy);
  }
}

const drawBackground = (context, canvas) => {
  if (background.complete) {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
};

const drawPredjudice = (context, currentFrame, x, y, dx, dy) => {
  if (prejudice.complete) {
    context.drawImage(prejudice, x, y, dx, dy);
  }
}

const drawPlayer = (context, canvas, playerImageId, dir, currentFrame, x, y, width, height) => {
  let horizontalOffset = 0;
  let horizontalFrameOffset = 0;
  let verticalFrameOffset = 0;

  switch (dir) {
    case "left":
      horizontalOffset = 757;
      break;
    case "right":
      horizontalOffset = 0;
      break;
    case "up":
      horizontalOffset = 549;
      break;
    case "down":
      horizontalOffset = 277;
      break;
  }

  if (dir === "left") {
    horizontalFrameOffset = playerLeftOffsetX[playerImageId][currentFrame];
    verticalFrameOffset = playerLeftOffsetY[playerImageId][currentFrame];
  }

  context.drawImage(
    playerImage,
    beginX + frameOffset * currentFrame + horizontalOffset + horizontalFrameOffset + playerImageIdOffsetX[playerImageId % 2],
    beginY + verticalFrameOffset + playerImageIdOffsetY[playerImageId],
    frameWidth,
    frameHeight,
    x,
    y,
    width,
    height
  );
};

const drawTextAbovePlayer = (context, text, x, y, fontSize = '16px', fontFace = 'Arial', textColor = 'black') => {
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.font = "24px Arial"; // Increase the pixel size to make the text bigger.
  context.textAlign = "center";
  context.fillText(text, x, y);
  context.strokeText(text, x, y);
};


export { drawBackground, drawPlayer, drawTextAbovePlayer, drawPrejudice};