import { useEffect, useRef, KeyboardEvent } from "react";
import cookieCutter from "cookie-cutter";
import io from "socket.io-client";
import { drawBackground, drawPlayer } from "../utils/spriteLogic";

interface Player {
  playerName: string;
  x: number;
  y: number;
  imageId: number;
  speed: number;
  dir: "up" | "down" | "left" | "right";
  currentFrame: number;
}

export default function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const player: Player = {
      playerName: cookieCutter.get("playerName") || "",
      x: 0,
      y: 0,
      imageId: 0,
      speed: 20,
      dir: "right",
      currentFrame: 0,
    };

    const socket = io();
    socket.emit("new player", player);

    setInterval(() => {
      socket.emit("movement", player);
    }, 1000 / 60);

    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event;

      if (key === "ArrowUp" || key === "w") {
        player.y -= player.speed;
        player.dir = "up";
        player.currentFrame++;
      } else if (key === "ArrowDown" || key === "s") {
        player.y += player.speed;
        player.dir = "down";
        player.currentFrame++;
      } else if (key === "ArrowLeft" || key === "a") {
        player.x -= player.speed;
        player.dir = "left";
        player.currentFrame++;
      } else if (key === "ArrowRight" || key === "d") {
        player.x += player.speed;
        player.dir = "right";
        player.currentFrame++;
      } else if (key >= "1" && key <= "9") {
        player.imageId = Number(key);
      } else if (key === "0") {
        player.imageId = 0;
      }
    }

    type PlayerId = string;
    type Players = Record<PlayerId, Player>;

    socket.on("state", (players: Players) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(context, canvas);
      Object.values(players).forEach((newPlayer) => {
        drawPlayer(
          context,
          canvas,
          newPlayer.imageId,
          newPlayer.dir,
          newPlayer.currentFrame,
          newPlayer.x,
          newPlayer.y,
          50,
          50
        );
      });
    });

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", () => {
      player.currentFrame = 0;
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", () => {});
    };
  }, []);

  return (
    <div>
      <canvas
        className='w-full h-full bg-white mt-[-25px]'
        ref={canvasRef}
        width={1000}
        height={650}
      />
    </div>
  );
}
