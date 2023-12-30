import { FC, useEffect, useState } from "react";
import TableElement from "./TableElement";
import { forecast, tableElementData } from "../types";

type TableParams = {
  forecest: forecast;
};

const Table: FC<TableParams> = ({ forecest }) => {
  const [forecestFormat, setForecestFormat] = useState<"day" | "7days">("day");

  useEffect(() => {
    if (forecest.hourly.temperature_2m.length === 24) setForecestFormat("day");
    else setForecestFormat("7days");
  }, [forecest]);

  const getAvg = (arr: number[]) => {
    const sum = arr.reduce((prv, curr) => prv + curr);

    return (sum / arr.length).toFixed(1);
  };

  return (
    <div className="grid md:grid-cols-2 gap-y-10 gap-x-6 text-xs lg:text-sm lg:mx-5 mt-10">
      <ul className={`flex justify-between`}>
        <li className="w-1/6 text-center">Godzina</li>
        <li className="w-1/4 text-center">Zachmurzenie</li>
        <li className="w-1/4 text-center">Temperatura</li>
        <li className="w-1/4 text-center">Porywy wiatru</li>
        <li className="w-1/4 text-center">Opady</li>
      </ul>
      <ul className={`hidden md:flex justify-between`}>
        <li className="w-1/6 text-center">Godzina</li>
        <li className="w-1/4 text-center">Zachmurzenie</li>
        <li className="w-1/4 text-center">Temperatura</li>
        <li className="w-1/4 text-center">Porywy wiatru</li>
        <li className="w-1/4 text-center">Opady</li>
      </ul>
      {forecest.hourly.temperature_2m.map((__, index) => {
        if (forecestFormat === "7days" && index % 24 !== 0) return;

        let elementData = {};

        if (forecestFormat === "day")
          elementData = {
            time: forecest.hourly.time[index],
            weatherIcon: forecest.hourly.weathercode[index],
            temperature: forecest.hourly.temperature_2m[index],
            windSpeed: forecest.hourly.windspeed_10m[index],
            precipitation: forecest.hourly.precipitation[index],
          };
        else
          elementData = {
            time: forecest.hourly.time[index + 12],
            weatherIcon: forecest.hourly.weathercode[index + 12],
            temperature: getAvg(forecest.hourly.temperature_2m.slice(index + 7, index + 19)),
            windSpeed: getAvg(forecest.hourly.windspeed_10m.slice(index + 7, index + 19)),
            precipitation: getAvg(forecest.hourly.precipitation.slice(index + 7, index + 19)),
          };

        return <TableElement key={index} format={forecestFormat} data={elementData as tableElementData} />;
      })}
    </div>
  );
};

export default Table;
