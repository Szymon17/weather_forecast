import { FC } from "react";

type TableElementParam = {
  data: {
    time: string;
    weatherIcon: number;
    temperature: number;
    windSpeed: number;
    precipitation: number;
  };
  format: "day" | "7days";
};

const TableElement: FC<TableElementParam> = ({ data, format }) => {
  const { time, weatherIcon, temperature, windSpeed, precipitation } = data;

  const displayTime = (stringDate: string) => {
    if (format === "day") return new Date(stringDate).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    else return new Date(stringDate).toLocaleDateString("pl-PL", { day: "2-digit", month: "short" });
  };

  return (
    <ul className="flex justify-between gap-1 text-white">
      <li className="w-1/6 text-center px-2 py-5 bg-cyan-400 rounded">{displayTime(time)}</li>
      <li className="w-1/4 text-center px-2 py-5 bg-zinc-600 rounded">{weatherIcon}</li>
      <li className="w-1/4 text-center px-2 py-5 bg-zinc-600 rounded">{temperature + "°C"}</li>
      <li className="w-1/4 text-center px-2 py-5 bg-zinc-600 rounded">{windSpeed + "km/h"}</li>
      <li className="w-1/4 text-center px-2 py-5 bg-zinc-600 rounded">{precipitation + "mm"}</li>
    </ul>
  );
};

export default TableElement;
