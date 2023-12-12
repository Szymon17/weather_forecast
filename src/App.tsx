import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";
import Header from "./components/header";
import Prediction from "./components/prediction";

function App() {
  const { forecast, location, fetchData } = useContext(ForecestContext);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  console.log(forecast);

  return (
    <div className="App h-screen flex flex-col overflow-hidden">
      <Header forecest={forecast} location={location} />
      <Prediction />
    </div>
  );
}

export default App;
