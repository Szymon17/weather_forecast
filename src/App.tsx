import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";
import Header from "./components/header";

function App() {
  const { forecast, location, fetchData } = useContext(ForecestContext);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  return (
    <div className="App">
      <Header forecest={forecast} location={location}></Header>
    </div>
  );
}

export default App;
