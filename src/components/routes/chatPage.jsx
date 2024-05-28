import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../utils/contextProvider";
import styles from "../../styles/routes/chat.module.css";

import ChatBody from "./chatComponents/chatBody";
import ChatFooter from "./chatComponents/chatFooter";

export default function ChatPage() {
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams();

  useEffect(() => {
    if (socket != null) {
      console.log("join room");
      socket.emit("join room", roomId);
    }

    return () => {
      if (socket != null) {
        console.log("leaves room");
        socket.emit("leaves room", roomId);
      }
    };
  }, [socket, roomId]);

  return (
    <div className={styles["chat-page"]}>
      <ChatBody socket={socket} />
      <ChatFooter socket={socket} roomId={roomId} />
    </div>
  );
}
