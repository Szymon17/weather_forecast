import { useContext, useEffect, useRef, useState } from "react";
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

  const { forecast24h, forecast7days } = useContext(ForecestContext);

  useEffect(() => {
    if (!forecast7days || !forecast24h) return;

    if (predictionType === "day") {
      setTemperatures(forecast24h.hourly.temperature_2m);
      setDates(forecast24h.hourly.time);
    } else {
      setTemperatures(forecast7days.hourly.temperature_2m);
      setDates(forecast7days.hourly.time);
    }
  }, [predictionType, forecast7days]);

  return (
    <main className="sm:mx-10 pt-5 h-1/2 grow flex flex-col">
      <div className="2xl:mx-40 flex gap-10 justify-center lg:text-xl 2xl:text-3xl mb-2">
        <Button
          onMouseEnter={() => setHoverState("day")}
          onMouseLeave={() => setHoverState(null)}
          name="day"
          onClick={() => setPredictionType("day")}
          buttonType={predictionType === "day" || hoverState === "day" ? "base" : "reverse"}
        >
          Prognoza pogody na dziś
        </Button>
        <Button
          name="7days"
          onMouseEnter={() => setHoverState("7days")}
          onMouseLeave={() => setHoverState(null)}
          onClick={() => setPredictionType("7days")}
          buttonType={predictionType === "7days" || hoverState === "7days" ? "base" : "reverse"}
        >
          Prognoza pogody na 7dni
        </Button>
      </div>
      <div ref={chartContainerRef} className="w-full grow overflow-hidden">
        {chartContainerRef.current && forecast7days && (
          <Chart parent={chartContainerRef.current} className="border-black border-2 w-full h-full" dates={dates} values={temperatures} />
        )}
      </div>
    </main>
  );
};

export default Prediction;
