import { useContext, useEffect, useRef, useState } from "react";
import { ForecestContext } from "../context/forecast.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faTable } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import Chart from "./Chart/Chart";
import Table from "./Table";
import { forecast } from "../types";

type predictionTypes = "day" | "7days";
type hoverStateType = "day" | "7days" | null;
type displayType = "chart" | "table";

const Prediction = () => {
  const [actualForecest, setActualForecest] = useState<forecast>();
  const [predictionType, setPredictionType] = useState<predictionTypes>("day");
  const [hoverState, setHoverState] = useState<hoverStateType>(null);
  const [displayType, setDisplayType] = useState<displayType>("table");

  const { forecast24h, forecast7days } = useContext(ForecestContext);

  const changeDisplayStyle = () => {
    if (displayType === "table") setDisplayType("chart");
    else setDisplayType("table");
  };

  useEffect(() => {
    if (!forecast7days || !forecast24h) return;

    if (predictionType === "day") setActualForecest(forecast24h);
    else setActualForecest(forecast7days);
  }, [predictionType, forecast7days]);

  return (
    <main className="lg:mx-auto pt-5 h-1/2 w-full grow flex flex-col max-h-[1000px] max-w-[2000px] ">
      <div className="2xl:mx-40 relative flex gap-10 justify-center lg:text-xl 2xl:text-3xl mb-2">
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
        <FontAwesomeIcon
          className="absolute z-10 right-5 sm:text-2xl md:text-4xl -bottom-16 md:right-10 md:top-0 cursor-pointer"
          icon={displayType === "chart" ? faTable : faChartLine}
          onClick={changeDisplayStyle}
        />
      </div>
      {actualForecest && (
        <div className="w-full grow">
          {displayType === "chart" ? (
            <Chart dates={actualForecest.hourly.time} values={actualForecest.hourly.temperature_2m} type={predictionType} />
          ) : (
            <Table forecest={actualForecest} />
          )}
        </div>
      )}
    </main>
  );
};

export default Prediction;
