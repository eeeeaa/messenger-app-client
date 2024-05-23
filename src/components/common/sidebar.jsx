import styles from "../../styles/common/sidebar.module.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, SocketContext } from "../../utils/contextProvider";

function Misc() {
  return <div>misc</div>;
}

function OnlineList() {
  const { socket } = useContext(SocketContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("usersResponse", (data) => {
        console.log("stuff");
        setUsers(data);
      });
    }
  }, [socket]);

  return (
    <ul>
      {users.length > 0 ? (
        users.map((user) => {
          return (
            <li key={user._id}>
              {user.username} ({user.status})
            </li>
          );
        })
      ) : (
        <li>no users</li>
      )}
    </ul>
  );
}

function Profile() {
  const { getCurrentUser } = useContext(AppContext);
  return <div>{getCurrentUser()}</div>;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { removeCurrentUser, removeCookie } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket != null) {
      socket.emit("user online");
      socket.emit("get users");
    }
  }, [socket]);

  const handleLogout = () => {
    socket.emit("user offline");
    removeCookie("token");
    removeCurrentUser();
    navigate("/auth/login");
  };
  return (
    <div className={styles["container"]}>
      <button className={styles["logout-button"]} onClick={handleLogout}>
        Logout
      </button>
      <Profile />
      <OnlineList />
      <Misc />
    </div>
  );
}
