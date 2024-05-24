import styles from "../../styles/routes/createRoom.module.css";
import { AppContext } from "../../utils/contextProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRoom } from "../../domain/room/roomUseCase";

export default function CreateRoom() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  const [roomName, setRoomName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { room, error } = await postRoom(cookies["token"], {
        room_name: roomName,
      });
      if (error) {
        navigate("/error");
      } else {
        navigate("/");
      }
    } catch (e) {
      navigate("/error");
    }
  };

  return (
    <div className={styles["container"]}>
      <form onSubmit={handleSubmit} className={styles["card"]}>
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
        <button className={styles["create-room-button"]} type="submit">
          Create room
        </button>
      </form>
    </div>
  );
}
