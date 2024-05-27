import { useEffect, useState, useRef } from "react";
import styles from "../../../styles/routes/chat.module.css";
import LinesEllipsis from "react-lines-ellipsis";
import PropTypes from "prop-types";

import LoadingPage from "../../common/loadingPage";

ChatMessage.propTypes = {
  message: PropTypes.object,
};

ChatBody.propTypes = {
  socket: PropTypes.object,
};

function ChatMessage({ message }) {
  return (
    <div className={styles["chat-message"]}>
      <div className={styles["chat-message-header"]}>
        <LinesEllipsis
          className={styles["chat-author"]}
          text={
            message.user.display_name === undefined
              ? message.user.username
              : message.user.display_name
          }
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </div>
      <div className={styles["chat-message-content"]}>
        <LinesEllipsis
          className={styles["profile-name"]}
          text={message.message_content}
          maxLine="3"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </div>
      <div className={styles["chat-message=footer"]}>
        <LinesEllipsis
          className={styles["chat-date"]}
          text={message.created_at}
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </div>
    </div>
  );
}

export default function ChatBody({ socket }) {
  const lastMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //scrolls to bottom when messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("onJoinRoom", (user) => {
      setLoading(false);
      //join
    });

    socket.on("onLeaveRoom", (user) => {
      //leave
    });

    socket.on("messageResponse", (data) => {
      setLoading(false);
      setMessages(data);
    });
  }, [socket]);

  if (loading)
    return (
      <div className={styles["chat-body"]}>
        <LoadingPage />
      </div>
    );

  return (
    <div className={styles["chat-body"]}>
      {messages.length > 0 ? (
        messages.map((message) => {
          return <ChatMessage key={message._id} message={message} />;
        })
      ) : (
        <div>no messages</div>
      )}
      <div ref={lastMessageRef}></div>
    </div>
  );
}
