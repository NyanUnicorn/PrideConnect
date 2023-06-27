import { useState, useEffect, useRef, KeyboardEvent } from "react";
import cookieCutter from "cookie-cutter";
import { faker } from "@faker-js/faker";
import io from "socket.io-client";
import {
  drawBackground,
  drawPlayer,
  drawTextAbovePlayer,
  drawPrejudice,
} from "../utils/spriteLogic";

interface Player {
  playerName: string;
  x: number;
  y: number;
  imageId: number;
  speed: number;
  dir: "up" | "down" | "left" | "right";
  currentFrame: number;
  message: string;
}

export default function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");

  const player: Player = useRef({
    playerName: faker.internet.userName(),
    x: 0,
    y: 0,
    imageId: 0,
    speed: 20,
    dir: "right",
    currentFrame: 0,
    message: "",
  }).current;

  const socket = useRef(io()).current;

  useEffect(() => {
    socket.emit("new player", player);

    const interval = setInterval(() => {
      socket.emit("movement", player);
    }, 1000 / 60);

    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event;

      if (key === "ArrowUp") {
        player.y -= player.speed;
        player.dir = "up";
        player.currentFrame++;
      } else if (key === "ArrowDown") {
        player.y += player.speed;
        player.dir = "down";
        player.currentFrame++;
      } else if (key === "ArrowLeft") {
        player.x -= player.speed;
        player.dir = "left";
        player.currentFrame++;
      } else if (key === "ArrowRight") {
        player.x += player.speed;
        player.dir = "right";
        player.currentFrame++;
      } else if (key >= "1" && key <= "9") {
        player.imageId = Number(key);
      } else if (key === "0") {
        player.imageId = 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", () => {
      player.currentFrame = 0;
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", () => {});
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    type PlayerId = string;
    type Players = Record<PlayerId, Player>;

    const drawPlayers = (players: Players) => {
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
        drawTextAbovePlayer(
          context,
          newPlayer.playerName,
          newPlayer.x,
          newPlayer.y - 10
        );

        if (newPlayer.message) {
          drawTextAbovePlayer(
            context,
            newPlayer.message,
            newPlayer.x,
            newPlayer.y - 30
          );
        }
      });
    };

    socket.on("state", drawPlayers);

    return () => {
      socket.off("state", drawPlayers);
    };
  }, [player.message]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    player.message = message;
    setMessage("");
  };

  return (
    <div>
      <canvas
        className='w-full h-full bg-white mt-[-25px]'
        ref={canvasRef}
        width={1000}
        height={650}
      />
      <hr />
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            id='chatbox'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}
