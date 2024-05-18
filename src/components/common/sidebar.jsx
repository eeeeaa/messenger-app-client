import styles from "../../styles/common/sidebar.module.css";

function Misc() {
  return <div>misc</div>;
}

function OnlineList() {
  return <div>online user list</div>;
}

function Profile() {
  return <div>profile</div>;
}

export default function Sidebar() {
  return (
    <div className={styles["container"]}>
      <Profile />
      <OnlineList />
      <Misc />
    </div>
  );
}
