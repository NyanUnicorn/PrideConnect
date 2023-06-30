enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

interface Player {
  playerName: string;
  x: number;
  y: number;
  imageId: number;
  speed: number;
  dir: Direction;
  currentFrame: number;
  message: string;
}
