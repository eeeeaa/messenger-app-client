import { useState, useEffect } from "react";

const roomsUri = `${import.meta.env.VITE_MESSENGER_API_URL}/v1/rooms`;

export const useGetRooms = (token) => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${roomsUri}`, {
      method: "GET",
      mode: "cors",
      headers: headers,
    })
      .then(async (response) => {
        if (response.status >= 400) {
          console.log(response);
          const json = await response.json();
          throw new Error(json.message);
        }
        return response.json();
      })
      .then((response) => {
        setRooms(response.rooms);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [token]);

  return { rooms, error, loading };
};

export const postRoom = async (token, { room_name }) => {
  let room = null;
  let error = null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  await fetch(roomsUri, {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify({ room_name: room_name }),
  })
    .then(async (response) => {
      if (response.status >= 400) {
        console.log(response);
        const json = await response.json();
        throw new Error(json.message);
      }
      return response.json();
    })
    .then((response) => {
      room = response.room;
    })
    .catch((err) => (error = err));

  return { room, error };
};

export const deleteRoom = async (token, roomId) => {
  let room = null;
  let error = null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  await fetch(`${roomsUri}/${roomId}`, {
    method: "DELETE",
    mode: "cors",
    headers: headers,
  })
    .then(async (response) => {
      if (response.status >= 400) {
        console.log(response);
        const json = await response.json();
        throw new Error(json.message);
      }
      return response.json();
    })
    .then((response) => {
      room = response.deletedRoom;
    })
    .catch((err) => (error = err));

  return { room, error };
};
