import "./App.css";
import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";

function App() {
  const { forecast, fetchData, location } = useContext(ForecestContext);

  console.log(forecast);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  return <div className="App">{`${location}`}</div>;
}

export default App;
