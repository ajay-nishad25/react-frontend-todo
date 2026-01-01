import React from "react";
import Navbar from "layout/Navbar";
import TodoHome from "pages/TodoHome";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <TodoHome />
    </div>
  );
}
