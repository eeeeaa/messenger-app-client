import io from "socket.io-client";

export function createSocket(token) {
  if (token === undefined) return null;
  const socket = io(import.meta.env.VITE_MESSENGER_API_URL, {
    extraHeaders: {
      authorization: `bearer ${token}`,
    },
  });
  return socket;
}
