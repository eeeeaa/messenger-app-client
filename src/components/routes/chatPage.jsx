import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../../utils/contextProvider";
import styles from "../../styles/routes/chat.module.css";

import ChatBody from "./chatComponents/chatBody";
import ChatFooter from "./chatComponents/chatFooter";

export default function ChatPage() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams();

  useEffect(() => {
    if (socket != null) {
      socket.emit("join room", roomId);

      socket.on("onKicked", () => {
        socket.emit("leaves room", roomId);
        navigate("/");
      });
    }

    return () => {
      if (socket != null) {
        socket.emit("leaves room", roomId);
      }
    };
  }, [socket, roomId, navigate]);

  return (
    <div className={styles["chat-page"]}>
      <ChatBody socket={socket} />
      <ChatFooter socket={socket} roomId={roomId} />
    </div>
  );
}
