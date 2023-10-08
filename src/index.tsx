import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ForecastProvider from "./context/forecast.context";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ForecastProvider>
      <App />
    </ForecastProvider>
  </React.StrictMode>
);

reportWebVitals();
