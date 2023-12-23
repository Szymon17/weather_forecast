import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";
import Header from "./components/Header";
import Prediction from "./components/Prediction";

function App() {
  const { forecast24h, location, fetchData } = useContext(ForecestContext);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  console.log(forecast24h);

  return (
    <div className="App h-screen flex flex-col ">
      <Header forecest={forecast24h} location={location} />
      <Prediction />
    </div>
  );
}

export default App;
