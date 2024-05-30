import styles from "../../styles/routes/setting.module.css";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import { updateProfile } from "../../domain/user/userUseCase";

import LoadingPage from "../common/loadingPage";
import ErrorPage from "../common/error";

export default function Setting() {
  const [settingNotice, setSettingNotice] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { getCurrentUser, cookies, removeCookie, removeCurrentUser } =
    useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const passwordConfirmElement = useRef();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser.username.trim()) {
      setUsername(currentUser.username);
    } else {
      setUsername("");
    }
    if (currentUser.display_name.trim()) {
      setDisplayName(currentUser.display_name);
    } else {
      setDisplayName("");
    }

    if (password.length > 0 && password.trim() !== passwordConfirm.trim()) {
      passwordConfirmElement.current.setCustomValidity(
        "password does not match!"
      );
      passwordConfirmElement.current.reportValidity();
    } else {
      passwordConfirmElement.current.setCustomValidity("");
      passwordConfirmElement.current.reportValidity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentUser, passwordConfirm]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (
      username !== currentUser.username ||
      displayName !== currentUser.display_name ||
      (password.length > 0 && password.trim() === passwordConfirm.trim())
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [username, displayName, password, passwordConfirm, getCurrentUser]);

  const handleLogout = () => {
    if (socket != null) {
      socket.emit("user offline");
    }
    removeCookie("token");
    removeCurrentUser();
    navigate("/auth/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();

    try {
      setLoading(true);
      const { user, error } = await updateProfile(
        {
          username:
            username.trim() && username !== currentUser.username
              ? username
              : undefined,
          display_name:
            displayName.trim() && displayName !== currentUser.display_name
              ? displayName
              : undefined,
          password: password.trim() ? password : undefined,
        },
        cookies["token"],
        getCurrentUser().user_id
      );
      setLoading(false);
      if (error) {
        setErr(error);
        return;
      }
      if (socket != null) {
        socket.emit("update profile", user);
        socket.emit("user refresh");
      }
      setSettingNotice("information updated");
      if (password.trim()) {
        handleLogout();
      }
    } catch (e) {
      setErr(e);
    }
  };

  if (err) return <ErrorPage errorMsg={err.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles.container}>
      <div>{settingNotice}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles["form-field"]}>
          <legend>Profile information</legend>
          <div className={styles["form-item"]}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles["form-item"]}>
            <label htmlFor="display_name">Display name</label>
            <input
              type="text"
              name="display_name"
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className={styles["form-field"]}>
          <legend>Update password</legend>
          <div className={styles["form-item"]}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles["form-item"]}>
            <label htmlFor="password_confirm">New Password confirm</label>
            <input
              type="password"
              name="password_confirm"
              id="password_confirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              ref={passwordConfirmElement}
            />
          </div>
        </fieldset>
        <button
          className={styles["submit-button"]}
          type="submit"
          disabled={!isButtonEnabled}
        >
          Apply changes
        </button>
      </form>
    </div>
  );
}
