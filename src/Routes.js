import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Layout from "layout/Layout";
import Login from "pages/Login";
import Signup from "pages/Signup";
import TodoBoard from "pages/TodoBoard";
import NotFound from "pages/NotFound";

// Redirects authenticated users away from public-only routes (login/signup)
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Routes() {
  let routes = useRoutes([
    // public routes — redirect to home if already logged in
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
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

    // 404 catch-all
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return routes;
}

export default Routes;

