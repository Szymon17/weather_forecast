import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
import { ForecestContext } from "./context/forecast.context";
import Header from "./components/Header";
import Prediction from "./components/Prediction";
import { ToastContainer } from "react-toastify";

function App() {
  const { forecast24h, location, fetchData } = useContext(ForecestContext);

  useEffect(() => {
    fetchData("Warszawa");
  }, []);

  return (
    <div className="App h-screen flex flex-col">
      <Header forecest={forecast24h} location={location} />
      <Prediction />
      <ToastContainer />
    </div>
  );
}

export default App;
