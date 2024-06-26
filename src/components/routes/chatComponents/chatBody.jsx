import { useEffect, useState, useRef, useContext } from "react";
import styles from "../../../styles/routes/chat.module.css";
import LinesEllipsis from "react-lines-ellipsis";
import PropTypes from "prop-types";

import LoadingPage from "../../common/loadingPage";
import { AppContext } from "../../../utils/contextProvider";

ChatMessage.propTypes = {
  message: PropTypes.object,
  isLast: PropTypes.bool,
};

ChatBody.propTypes = {
  socket: PropTypes.object,
  roomName: PropTypes.string,
};

function ChatMessage({ message, isLast }) {
  const { getCurrentUser } = useContext(AppContext);
  const name =
    message.user.display_name === undefined
      ? message.user.username
      : message.user.display_name;

  const isUser = message.user._id === getCurrentUser().user_id;

  return (
    <div className={isLast ? styles["last-message"] : styles["chat-message"]}>
      <div className={styles["chat-message-header"]}>
        <LinesEllipsis
          className={styles["chat-author"]}
          text={name}
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
        {isUser ? <div>(you)</div> : <></>}
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
          text={new Date(message.created_at).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </div>
    </div>
  );
}

export default function ChatBody({ socket, roomName }) {
  const lastMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //scrolls to bottom when messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket !== null) {
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
    }
  }, [socket]);

  if (loading)
    return (
      <div className={styles["chat-body"]}>
        <LoadingPage />
      </div>
    );

  return (
    <div className={styles["chat-body"]}>
      <h1 className={styles["chat-title"]}>{roomName}</h1>
      {messages.length > 0 ? (
        messages.map((message, index) => {
          const isLast = index === messages.length - 1;
          return (
            <ChatMessage key={message._id} message={message} isLast={isLast} />
          );
        })
      ) : (
        <div>no messages</div>
      )}
      <div ref={lastMessageRef}></div>
    </div>
  );
}
