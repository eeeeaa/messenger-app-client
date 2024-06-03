import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import { deleteRoom } from "../../domain/room/roomUseCase";
import styles from "../../styles/routes/deleteRoom.module.css";

import { MdDelete } from "react-icons/md";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";

export default function DeleteRoom() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { cookies } = useContext(AppContext);
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const handleDeleteClick = async () => {
    setIsButtonEnabled(false);
    try {
      setLoading(true);
      const { room, error } = await deleteRoom(cookies["token"], roomId);
      setLoading(false);
      if (error) {
        setErr(error);
      } else {
        if (socket !== null) {
          socket.emit("kick all users from room", roomId);
        }
        navigate("/");
      }
    } catch (e) {
      setErr(e);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (err) return <ErrorPage errorMsg={err.message} />;

  if (loading) return <LoadingPage />;

  return (
    <div className={styles["container"]}>
      <div className={styles["card"]}>
        <div className={styles["header"]}>
          <MdDelete className={styles["icon"]} />
          <h2 className={styles["title"]}>Delete Room</h2>
        </div>
        <div className={styles["content"]}>
          Are you sure you want to delete room{" "}
          <span className={styles["room-id"]}>
            {searchParams.get("name")} ({roomId})
          </span>
          ? all messages associated with this room will also be deleted!
        </div>
        <div className={styles["buttons"]}>
          <button
            className={styles["back-button"]}
            onClick={handleGoBack}
            disabled={!isButtonEnabled}
          >
            Go back
          </button>
          <button
            className={styles["delete-button"]}
            onClick={handleDeleteClick}
          >
            Delete room
          </button>
        </div>
      </div>
    </div>
  );
}
