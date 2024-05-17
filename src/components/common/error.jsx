import { Link } from "react-router-dom";
import styles from "../../styles/common/errorPage.module.css";
import PropTypes from "prop-types";

const ErrorPage = ({ errorMsg = null }) => {
  return (
    <div className={styles.container}>
      {errorMsg != null ? (
        <h1 data-testid="error-page-message">Error: {errorMsg}</h1>
      ) : (
        <h1 data-testid="error-page-message">
          Oh no, this route doesn&apos;t exist!
        </h1>
      )}
      <Link to="/">Click here to go back home</Link>
    </div>
  );
};

ErrorPage.propTypes = {
  errorMsg: PropTypes.string,
};

export default ErrorPage;
