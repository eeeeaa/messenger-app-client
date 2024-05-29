import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext, SocketContext } from "../../utils/contextProvider";
import { deleteRoom } from "../../domain/room/roomUseCase";

export default function DeleteRoom() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { cookies } = useContext(AppContext);
  const { roomId } = useParams();

  const handleDeleteClick = async () => {
    try {
      const { room, error } = await deleteRoom(cookies["token"], roomId);
      if (error) {
        navigate("/error");
      } else {
        if (socket !== null) {
          socket.emit("kick all users from room", roomId);
        }
        navigate("/");
      }
    } catch (e) {
      navigate("/error");
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

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
