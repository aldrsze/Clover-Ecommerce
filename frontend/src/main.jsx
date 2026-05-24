import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/styles.css";
import "./components/index.css";
import "./pages/Public/HomePage/HomePage.css";
import "./pages/Public/ProductsPage/ProductsPage.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
