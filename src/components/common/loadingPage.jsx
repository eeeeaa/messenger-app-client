import styles from "../../styles/common/loadingPage.module.css";
function LoadingPage() {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
}

export default LoadingPage;
