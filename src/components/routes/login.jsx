import styles from "../../styles/routes/login.module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../utils/contextProvider";

import { loginUseCase } from "../../domain/auth/authUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";

export default function Login() {
  const navigate = useNavigate();
  const { setCookie } = useContext(AppContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUseCase(username, password);
      setCookie("token", data.token, {
        secure: true,
        httpOnly: false,
        sameSite: true,
        maxAge: 10800, //3 hours
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles["content"]}>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <div className={styles["login-header"]}>
          <h1 className={styles["login-title"]}>Chatter</h1>
          <div className={styles["login-subtitle"]}>please login</div>
        </div>
        <div className={styles["form-input"]}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-input"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles["login-button"]} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
