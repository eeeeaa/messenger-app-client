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
import Login from "./routes/login";
import Sidebar from "./common/sidebar";
import { useEffect } from "react";
import { useState, useContext } from "react";

import { createSocket } from "../domain/socket/socketUseCase";

function Auth() {
  return <Outlet />;
}

function Root() {
  const navigate = useNavigate();
  const { cookies } = useContext(AppContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/auth/signup");
      return;
    }
    setSocket(createSocket(cookies["token"]));
  }, [navigate, cookies]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <div className="content">
        <Sidebar />
        <Outlet />
      </div>
    </SocketContext.Provider>
  );
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const getCurrentUser = () => {
    return localStorage.getItem("username");
  };

  const setCurrentUser = (username) => {
    localStorage.setItem("username", username);
  };

  const removeCurrentUser = () => {
    localStorage.removeItem("username");
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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
