import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";

type ClientMessage = {
  id: string;
  text: string;
  ownerId: string;
  ownerUsername: string;
  createdAt: string;
};

export const useChat = (
  roomId: string,
  existingMessages: ClientMessage[],
): [ClientMessage[], (text: string, ownerId: string, ownerUsername: string) => Promise<void>] => {
  const [messages, setMessages] = useState<ClientMessage[]>(existingMessages);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const PORT = process.env.SOCKET_PORT || 8080;
    socketRef.current = io(`http://localhost:${PORT}`);

    socketRef.current.emit("joinChat", {
      roomId: roomId,
    });

    socketRef.current.on("messageIn", (body: ClientMessage) => {
      setMessages((messages) => [...messages, body]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  });

  const sendMessage = async (text: string, ownerId: string, ownerUsername: string) => {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: roomId,
          userId: ownerId,
          text: text,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        socketRef.current?.emit("messageOut", {
          id: data.message._id,
          roomId: roomId,
          text: text,
          ownerId: ownerId,
          ownerUsername: ownerUsername,
          createdAt: data.message.created_at,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [messages, sendMessage];
};
