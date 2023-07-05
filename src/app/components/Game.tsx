"use client";

import React, { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker";
import io from "socket.io-client";
import {
  drawBackground,
  drawPlayer,
  drawTextAbovePlayer,
  drawPrejudice,
} from "../utils/spriteLogic";

export default function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");
  const [chatBubble, setChatBubble] = useState("");

  const player: Player = useRef({
    playerName: faker.internet.userName(),
    x: 0,
    y: 0,
    imageId: 0,
    speed: 20,
    dir: Direction.Up,
    currentFrame: 0,
    message: "",
  }).current;

  const socket = useRef(io()).current;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      switch (key) {
        case "ArrowUp":
          player.y -= player.speed;
          player.dir = Direction.Up;
          player.currentFrame++;
          break;
        case "ArrowDown":
          player.y += player.speed;
          player.dir = Direction.Down;
          player.currentFrame++;
          break;
        case "ArrowLeft":
          player.x -= player.speed;
          player.dir = Direction.Left;
          player.currentFrame++;
          break;
        case "ArrowRight":
          player.x += player.speed;
          player.dir = Direction.Right;
          player.currentFrame++;
          break;
        case "0":
          player.imageId = 0;
          break;
        default:
          if (key >= "1" && key <= "9") {
            player.imageId = Number(key);
          }
          break;
      }

      socket.emit("movement", player);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", () => {
      player.currentFrame = 0;
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", () => {
        player.currentFrame = 0;
      });
    };
  }, [player, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    type PlayerId = string;
    type Players = Record<PlayerId, Player>;

    const drawPlayers = (players: Players) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(context, canvas);
      drawPrejudice(context, 0, 325, 100, 350, 350);
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
          drawTextAbovePlayer(context, chatBubble, newPlayer.x, newPlayer.y - 30);
        }
      });
    };

    socket.on("state", drawPlayers);

    return () => {
      socket.off("state", drawPlayers);
    };
  }, [player.message, chatBubble, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatBubble(message);
    setMessage("");
  };

  useEffect(() => {
    if (chatBubble) {
      const timer = setTimeout(() => {
        setChatBubble("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [chatBubble]);
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}
