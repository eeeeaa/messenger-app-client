import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import { deleteRoom } from "../../domain/room/roomUseCase";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loadingPage";

export default function DeleteRoom() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { cookies } = useContext(AppContext);
  const { roomId } = useParams();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleDeleteClick = async () => {
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
    <div>
      <h1>Room deletion</h1>
      <div>
        Are you sure you want to delete room {roomId}? all messages associated
        with this room will also be deleted!
      </div>
      <div>
        <button onClick={handleGoBack}>Go back</button>
        <button onClick={handleDeleteClick}>Delete room</button>
      </div>
    </div>
  );
}
