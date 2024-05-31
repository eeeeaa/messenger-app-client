import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "../styles/App.css";
import { useCookies } from "react-cookie";
import { AppContext, SocketContext } from "../utils/contextProvider";

import ErrorPage from "./common/error";
import Home from "./routes/home";
import Setting from "./routes/setting";
import CreateRoom from "./routes/createRoom";
import Login from "./routes/login";
import ChatPage from "./routes/chatPage";
import Sidebar from "./common/sidebar";
import { useEffect } from "react";
import { useState, useContext } from "react";

import { createSocket } from "../domain/socket/socketUseCase";
import DeleteRoom from "./routes/deleteRoom";

function Auth() {
  return <Outlet />;
}

function Root() {
  const navigate = useNavigate();
  const { cookies, setCurrentUser, getCurrentUser } = useContext(AppContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();

      console.log("beforeunload event triggered");

      if (socket != null) {
        socket.emit("user offline");
      }

      return (event.returnValue = "Are you sure you want to exit?");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [socket]);

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/auth/signup");
      return;
    }
    setSocket(createSocket(cookies["token"]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket != null) {
      socket.on("profileResponse", (user) => {
        const currentUser = getCurrentUser();

        if (currentUser.user_id === user._id) {
          setCurrentUser({
            username: user.username,
            display_name: user.display_name,
            user_id: user._id,
          });
        }
      });
    }
  }, [socket, setCurrentUser, getCurrentUser]);

  if (cookies["token"] === undefined) {
    return <div></div>;
  } else {
    return (
      <SocketContext.Provider value={{ socket }}>
        <div className="content">
          <Sidebar />
          <div className="container">
            <div className="box">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </SocketContext.Provider>
    );
  }
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userId, setUserId] = useState("");

  const getCurrentUser = () => {
    return {
      username: username,
      display_name: displayName,
      user_id: userId,
    };
  };

  const setCurrentUser = ({ username, display_name, user_id }) => {
    localStorage.setItem("username", username);
    localStorage.setItem("display_name", display_name);
    localStorage.setItem("user_id", user_id);

    setUsername(localStorage.getItem("username"));
    setDisplayName(localStorage.getItem("display_name"));
    setUserId(localStorage.getItem("user_id"));
  };

  const removeCurrentUser = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("display_name");
    localStorage.removeItem("user_id");

    setUsername("");
    setDisplayName("");
    setUserId("");
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppContext.Provider
          value={{
            cookies,
            setCookie,
            removeCookie,
            getCurrentUser,
            setCurrentUser,
            removeCurrentUser,
          }}
        >
          <Root />
        </AppContext.Provider>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/setting",
          element: <Setting />,
        },
        {
          path: "/rooms/create",
          element: <CreateRoom />,
        },
        {
          path: "/rooms/:roomId",
          element: <ChatPage />,
        },
        {
          path: "/rooms/:roomId/delete",
          element: <DeleteRoom />,
        },
      ],
    },
    {
      path: "/auth",
      element: (
        <AppContext.Provider
          value={{
            cookies,
            setCookie,
            removeCookie,
            getCurrentUser,
            setCurrentUser,
            removeCurrentUser,
          }}
        >
          <Auth />
        </AppContext.Provider>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/auth/login",
          element: <Login isSignup={false} />,
        },
        {
          path: "/auth/signup",
          element: <Login isSignup={true} />,
        },
      ],
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
