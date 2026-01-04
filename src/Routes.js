import React from "react";
import { useRoutes } from "react-router-dom";
import Layout from "layout/Layout";
import Login from "pages/Login";
import Signup from "pages/Signup";
import TodoBoard from "pages/TodoBoard";

function Routes() {
  let routes = useRoutes([
    // public routes no need to login to see this
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },

    // Protected routes need login to see this
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <TodoBoard />,
        },
      ],
    },
  ]);

  return routes;
}

export default Routes;
