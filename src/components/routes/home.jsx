import { useContext, useState } from "react";
import styles from "../../styles/routes/home.module.css";
import { AppContext } from "../../utils/contextProvider";
import { useGetRooms } from "../../domain/room/roomUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";
import PropTypes from "prop-types";

Room.propTypes = {
  room: PropTypes.object,
};

Rooms.propTypes = {
  rooms: PropTypes.array,
};

function Room({ room }) {
  return <div>{room.room_name}</div>;
}

function Rooms({ rooms }) {
  return (
    <div>
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
