import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";
import Header from "./components/header";
import Prediction from "./components/prediction";

function App() {
  const { forecast24h, forecast7days, location, fetchData } = useContext(ForecestContext);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  console.log(forecast24h);

  return (
    <div className="App h-screen flex flex-col overflow-hidden">
      <Header forecest={forecast24h} location={location} />
      <Prediction />
    </div>
  );
}

export default App;
