import styles from "../../styles/routes/createRoom.module.css";
import { AppContext } from "../../utils/contextProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRoom } from "../../domain/room/roomUseCase";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";

import { IoCreateOutline } from "react-icons/io5";

export default function CreateRoom() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  const [roomName, setRoomName] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonEnabled(false);
    setLoading(true);
    try {
      const { room, error } = await postRoom(cookies["token"], {
        room_name: roomName,
      });
      if (error) {
        setErr(error);
      } else {
        navigate("/");
      }
      setLoading(false);
    } catch (e) {
      setErr(e);
    }
  };

  if (err) return <ErrorPage errorMsg={err.message} />;

  if (loading) return <LoadingPage />;

  return (
    <div className={styles["container"]}>
      <form onSubmit={handleSubmit} className={styles["card"]}>
        <div className={styles["header"]}>
          <IoCreateOutline className={styles["icon"]} />
          <h2 className={styles["title"]}>Create room</h2>
        </div>
        <div className={styles["input-field"]}>
          <label htmlFor="room_name">Room name:</label>
          <input
            className={styles["text-input"]}
            type="text"
            name="room_name"
            id="room_name"
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <button
          className={styles["create-room-button"]}
          type="submit"
          disabled={!isButtonEnabled}
        >
          Create room
        </button>
      </form>
    </div>
  );
}
