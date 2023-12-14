import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { ForecestContext } from "../context/forecast.context";
import Button from "./Button";
import Chart from "./chart";

type predictionTypes = "day" | "7days";
type hoverStateType = "day" | "7days" | null;

const Prediction = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [temperatures, setTemperatures] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [predictionType, setPredictionType] = useState<predictionTypes>("day");
  const [hoverState, setHoverState] = useState<hoverStateType>(null);
  const { forecast } = useContext(ForecestContext);

  useEffect(() => {
    if (forecast) {
      setTemperatures(forecast.hourly.temperature_2m);
      setDates(forecast.hourly.time);
    }
  }, [forecast]);

  const fetchPrediction = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.target) {
      setPredictionType(e.currentTarget.name as predictionTypes);

      if (e.currentTarget.name === "day" && forecast) {
        setTemperatures(forecast.hourly.temperature_2m);
        setDates(forecast.hourly.time);
      } else if (e.currentTarget.name === "7days" && forecast) {
        // setTemperatures(forecast.daily)
        // setDates(forecast.hourly.time)
      }
    }
  };

  console.log(forecast);
  return (
    <main className="sm:mx-10 pt-5 h-1/2 grow flex flex-col">
      <div className="2xl:mx-40 flex gap-10 justify-center lg:text-xl 2xl:text-3xl mb-2">
        <Button
          onMouseEnter={() => setHoverState("day")}
          onMouseLeave={() => setHoverState(null)}
          onClick={fetchPrediction}
          name="day"
          buttonType={predictionType === "day" || hoverState === "day" ? "base" : "reverse"}
        >
          Prognoza pogody na dziś
        </Button>
        <Button
          name="7days"
          onMouseEnter={() => setHoverState("7days")}
          onMouseLeave={() => setHoverState(null)}
          onClick={fetchPrediction}
          buttonType={predictionType === "7days" || hoverState === "7days" ? "base" : "reverse"}
        >
          Prognoza pogody na 7dni
        </Button>
      </div>
      <div ref={chartContainerRef} className="w-full grow overflow-hidden">
        {chartContainerRef.current && forecast && (
          <Chart parent={chartContainerRef.current} className="border-black border-2 w-full h-full" dates={dates} values={temperatures} />
        )}
      </div>
    </main>
  );
};

export default Prediction;
