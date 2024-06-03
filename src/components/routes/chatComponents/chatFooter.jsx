import styles from "../../../styles/routes/chat.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

ChatFooter.propTypes = {
  socket: PropTypes.object,
  roomId: PropTypes.string,
};

export default function ChatFooter({ socket, roomId }) {
  const [message, setMessage] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const handleTyping = () => {};

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket !== null) {
      socket.emit("send message", { roomid: roomId, message: message });
      setIsButtonEnabled(false);
    }

    if (socket !== null) {
      socket.on("messageResponse", (data) => {
        setIsButtonEnabled(true);
      });
    }
    setMessage("");
  };
  return (
    <div className={styles["chat-footer"]}>
      <form className={styles["form"]} onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className={styles["message"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className={styles["sendBtn"]} disabled={!isButtonEnabled}>
          SEND
        </button>
      </form>
    </div>
  );
}
