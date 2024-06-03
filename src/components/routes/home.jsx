import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/routes/home.module.css";
import { AppContext } from "../../utils/contextProvider";
import { useGetRooms } from "../../domain/room/roomUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";
import PropTypes from "prop-types";
import { IoChatbubblesOutline } from "react-icons/io5";

Room.propTypes = {
  room: PropTypes.object,
};

Rooms.propTypes = {
  rooms: PropTypes.array,
};

function Room({ room }) {
  const navigate = useNavigate();
  const handleJoinClick = () => {
    navigate(`/rooms/${room._id}?name=${room.room_name}`);
  };
  const handleDeleteClick = () => {
    navigate(`/rooms/${room._id}/delete?name=${room.room_name}`);
  };
  return (
    <div className={styles["room-item"]}>
      <IoChatbubblesOutline className={styles["chat-icon"]} />
      <div className={styles["room-title"]}>Room: {room.room_name}</div>
      <div className={styles["room-item-buttons"]}>
        <button className={styles["delete-button"]} onClick={handleDeleteClick}>
          Delete room
        </button>
        <button className={styles["join-button"]} onClick={handleJoinClick}>
          Join room
        </button>
      </div>
    </div>
  );
}

function Rooms({ rooms }) {
  return (
    <div className={styles["room-list"]}>
      {rooms.length > 0 ? (
        rooms.map((room) => {
          return <Room key={room._id} room={room} />;
        })
      ) : (
        <div>no rooms</div>
      )}
    </div>
  );
}

export default function Home() {
  const { cookies } = useContext(AppContext);
  const { rooms, error, loading } = useGetRooms(cookies["token"]);

  if (error) return <ErrorPage errorMsg={error.message} />;

  if (loading) return <LoadingPage />;

  return <Rooms rooms={rooms} />;
}
