import styles from "../../styles/routes/login.module.css";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../utils/contextProvider";
import PropTypes from "prop-types";

import { loginUseCase, signupUseCase } from "../../domain/auth/authUseCase";
import { getMyProfile } from "../../domain/user/userUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";

Login.propTypes = {
  isSignup: PropTypes.bool,
};

export default function Login({ isSignup = false }) {
  const navigate = useNavigate();
  const { setCookie, setCurrentUser } = useContext(AppContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      //sign up
      if (password !== passwordConfirm) {
        return;
      }
      try {
        setLoading(true);
        await signupUseCase(username, password, passwordConfirm);
        setLoading(false);
        navigate("/auth/login");
      } catch (error) {
        setError(error);
      }
    } else {
      //log in
      try {
        setLoading(true);
        const data = await loginUseCase(username, password);
        const { user, error } = await getMyProfile(data.token);

        if (error) {
          setError(error);
        }

        setCookie("token", data.token, {
          secure: true,
          httpOnly: false,
          sameSite: true,
          maxAge: 10800, //3 hours
        });

        setCurrentUser({
          username: user.username,
          display_name: user.display_name ? user.display_name : "",
          user_id: user._id,
        });
        setLoading(false);
        navigate("/");
      } catch (error) {
        setError(error);
      }
    }
  };

  if (error)
    return (
      <div className={styles["content"]}>
        <ErrorPage errorMsg={error.message} />
      </div>
    );
  if (loading)
    return (
      <div className={styles["content"]}>
        <LoadingPage />
      </div>
    );

  return (
    <div className={styles["content"]}>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <div className={styles["login-header"]}>
          <h1 className={styles["login-title"]}>Chatter</h1>
          <div className={styles["login-subtitle"]}>
            {isSignup ? <>please sign-up</> : <>please login</>}
          </div>
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
        {isSignup ? (
          <div className={styles["form-input"]}>
            <label htmlFor="password_confirm">Password</label>
            <input
              type="password"
              name="password_confirm"
              id="password_confirm"
              onChange={(e) => {
                if (password !== e.target.value) {
                  console.log(password);
                  console.log(e.target.value);
                  e.target.setCustomValidity("password not match!");
                } else {
                  e.target.setCustomValidity("");
                }
                e.target.reportValidity();
                setPasswordConfirm(e.target.value);
              }}
              required
            />
          </div>
        ) : (
          <></>
        )}
        {isSignup ? (
          <button className={styles["login-button"]} type="submit">
            Signup
          </button>
        ) : (
          <button className={styles["login-button"]} type="submit">
            Login
          </button>
        )}
        {isSignup ? (
          <div>
            already have an account?{" "}
            <Link to={"/auth/login"}>click here to login</Link>{" "}
          </div>
        ) : (
          <div>
            no account? <Link to={"/auth/signup"}>click here to signup</Link>{" "}
          </div>
        )}
      </form>
    </div>
  );
}
