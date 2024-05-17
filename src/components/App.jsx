import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "../styles/App.css";
import { useCookies } from "react-cookie";
import { AppContext } from "../utils/contextProvider";

import ErrorPage from "./common/error";
import Home from "./routes/home";
import Login from "./routes/login";
import Sidebar from "./common/sidebar";

function Root() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  if (cookies.token === undefined) {
    return (
      <AppContext.Provider
        value={{
          cookies,
          setCookie,
          removeCookie,
        }}
      >
        <Login />
      </AppContext.Provider>
    );
  }

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
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
