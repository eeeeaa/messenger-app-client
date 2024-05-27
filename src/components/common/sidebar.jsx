import styles from "../../styles/common/sidebar.module.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import LinesEllipsis from "react-lines-ellipsis";
import PropTypes from "prop-types";

UserItem.propTypes = {
  user: PropTypes.object,
};

Misc.propTypes = {
  handleLogout: PropTypes.func,
};

function UserItem({ user }) {
  return <li className={styles["users-item"]}>{user.username}</li>;
}

function OnlineList() {
  const { socket } = useContext(SocketContext);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (socket !== null) {
      socket.on("usersResponse", (data) => {
        setUsers(data.filter((user) => user.status === "Online"));
      });

      socket.on("onUserLeaves", (leaveUser) => {
        if (users === null) return;
        const filteredList = users.filter((user) => {
          return user._id !== leaveUser._id;
        });

        setUsers(filteredList);
      });
    }
  }, [socket, users]);
  return (
    <div className={styles["section"]}>
      <h2 className={styles["section-header"]}>Active Users</h2>
      <ul className={styles["users-list"]}>
        {users === null ? (
          <li>loading...</li>
        ) : (
          <>
            {users !== null && users.length > 0 ? (
              users.map((user) => {
                return <UserItem key={user._id} user={user} />;
              })
            ) : (
              <li>no users</li>
            )}
            {users !== null && users.length >= 10 ? (
              <li>and more...</li>
            ) : (
              <></>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

function Profile() {
  const { getCurrentUser } = useContext(AppContext);
  return (
    <div className={styles["profile-section"]}>
      <h2 className={styles["profile-header"]}>Profile</h2>
      <div>
        <LinesEllipsis
          className={styles["profile-name"]}
          text={getCurrentUser()}
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </div>
    </div>
  );
}

function Misc({ handleLogout }) {
  return (
    <div className={styles["section"]}>
      <h2 className={styles["section-header"]}>Settings</h2>
      <ul className={styles["setting-list"]}>
        <li>
          <Link className={styles["setting-item"]} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className={styles["setting-item"]} to="/rooms/create">
            Create room
          </Link>
        </li>
        <li>
          <Link className={styles["setting-item"]} to="/setting">
            Profile setting
          </Link>
        </li>
        <li className={styles["setting-item"]} onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { removeCurrentUser, removeCookie } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket != null) {
      socket.emit("user online");
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
      <Profile />
      <OnlineList />
      <Misc handleLogout={handleLogout} />
    </div>
  );
}
