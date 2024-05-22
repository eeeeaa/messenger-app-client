import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "../styles/App.css";
import { useCookies } from "react-cookie";
import { AppContext } from "../utils/contextProvider";
import PropTypes from "prop-types";

import ErrorPage from "./common/error";
import Home from "./routes/home";
import Login from "./routes/login";
import Sidebar from "./common/sidebar";
import { useEffect } from "react";

Root.propTypes = {
  cookies: PropTypes.object,
  setCookie: PropTypes.func,
  removeCookie: PropTypes.func,
};

Auth.propTypes = {
  cookies: PropTypes.object,
  setCookie: PropTypes.func,
  removeCookie: PropTypes.func,
};

function Auth({ cookies, setCookie, removeCookie }) {
  return (
    <AppContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
      }}
    >
      <Outlet />
    </AppContext.Provider>
  );
}

function Root({ cookies, setCookie, removeCookie }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.token === undefined) {
      navigate("/auth/signup");
      return;
    }
  });

  return (
    <AppContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
      }}
    >
      <div className="content">
        <Sidebar />
        <Outlet />
      </div>
    </AppContext.Provider>
  );
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Root
          cookies={cookies}
          setCookie={setCookie}
          removeCookie={removeCookie}
        />
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
        <Auth
          cookies={cookies}
          setCookie={setCookie}
          removeCookie={removeCookie}
        />
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
