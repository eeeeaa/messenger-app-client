import styles from "../../styles/routes/login.module.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles["content"]}>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <div className={styles["form-input"]}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div className={styles["form-input"]}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
