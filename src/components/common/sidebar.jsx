import styles from "../../styles/common/sidebar.module.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import LinesEllipsis from "react-lines-ellipsis";
import PropTypes from "prop-types";

import { FaRegUserCircle } from "react-icons/fa";
import { MdMiscellaneousServices } from "react-icons/md";

UserItem.propTypes = {
  user: PropTypes.object,
};

Misc.propTypes = {
  handleLogout: PropTypes.func,
};

function UserItem({ user }) {
  return (
    <li className={styles["users-item"]}>
      {user.display_name !== undefined ? user.display_name : user.username} (
      {user.status})
    </li>
  );
}

function OnlineList() {
  const { socket } = useContext(SocketContext);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (socket !== null) {
      socket.on("usersResponse", (data) => {
        setUsers(data);
      });
    }
  }, [socket, users]);
  return (
    <div className={styles["section"]}>
      <div className={styles["section-header"]}>
        <FaRegUserCircle className={styles["section-icon"]} />
        <h2 className={styles["section-title"]}>Users</h2>
      </div>
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
  const user = getCurrentUser();
  return (
    <div className={styles["profile-section"]}>
      <h2 className={styles["profile-header"]}>Profile</h2>
      <div>
        <LinesEllipsis
          className={styles["profile-name"]}
          text={user.display_name.trim() ? user.display_name : user.username}
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
      <div className={styles["section-header"]}>
        <MdMiscellaneousServices className={styles["section-icon"]} />
        <h2 className={styles["section-title"]}>Others</h2>
      </div>
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
