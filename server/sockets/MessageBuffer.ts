import { z } from "zod";

const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  timestamp: z.date(),
  senderId: z.string(),
  roomId: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

const MAX_MESSAGES = 100; // Maximum number of messages to store
const messages: (Message | null)[] = new Array(MAX_MESSAGES).fill(null);
let readIndex = 0; // Read pointer
let writeIndex = 0; // Write pointer
let messageCount = 0; // Current number of messages stored

// Function to add a new message
export const addMessage = (message: Message) => {
  messages[writeIndex] = message;
  writeIndex = (writeIndex + 1) % MAX_MESSAGES;
  if (messageCount < MAX_MESSAGES) {
    messageCount++;
  } else {
    readIndex = (readIndex + 1) % MAX_MESSAGES;
  }
};

// Function to get all messages
export const getAllMessages = (): Message[] => {
  if (messageCount === 0) {
    return [];
  }
  const result: Message[] = [];
  let index = readIndex;
  for (let i = 0; i < messageCount; i++) {
    if (messages[index] !== null) {
      result.push(messages[index] as Message);
    }
    index = (index + 1) % MAX_MESSAGES;
  }
  return result;
};
