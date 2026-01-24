import "./App.css";
import Routes from "Routes";
import { BrowserRouter } from "react-router-dom";
import { useLayoutEffect } from "react";
import { initTheme } from "utils/theme";

function App() {
  useLayoutEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
