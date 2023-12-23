import { FC, useEffect, useState } from "react";
import TableElement from "./TableElement";
import { forecast } from "../types";

type TableParams = {
  forecest: forecast;
};

const Table: FC<TableParams> = ({ forecest }) => {
  const [forecestFormat, setForecestFormat] = useState<"day" | "7days">("day");

  useEffect(() => {
    if (forecest.hourly.temperature_2m.length === 24) setForecestFormat("day");
    else setForecestFormat("7days");
  }, [forecest]);

  return (
    <div className="grid md:grid-cols-2 gap-y-10 gap-x-6 text-xs lg:text-sm lg:mx-20 mt-10">
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

        const elementData = {
          time: forecest.hourly.time[index],
          weatherIcon: forecest.hourly.weathercode[index],
          temperature: forecest.hourly.temperature_2m[index],
          windSpeed: forecest.hourly.windspeed_10m[index],
          precipitation: forecest.hourly.precipitation[index],
        };

        return <TableElement key={index} format={forecestFormat} data={elementData} />;
      })}
    </div>
  );
};

export default Table;
