import { FC, useEffect, useState } from "react";
import { forecast, location } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faCompass, faPeopleGroup, faSearch, faTemperatureHigh, faWind } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Search from "./search";
import WeatherCodeIcon from "./weatherCodeIcon";
import ParametrSnapshot from "./parametrSnapshot";

type Header = {
  forecest: forecast | null;
  location: location | null;
};

const Header: FC<Header> = ({ forecest, location }) => {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState<number | undefined>();

  useEffect(() => {
    setTemperature(getTemperatureNow(time));

    const intervalIndex = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      setTemperature(getTemperatureNow(newTime));
    }, 1000);

    return () => {
      clearInterval(intervalIndex);
    };
  }, [setTime, setTemperature, forecest]);

  const getTemperatureNow = (date: Date): number | undefined => {
    const hourNow = date.getHours();

    return forecest?.hourly.temperature_2m[hourNow - 1];
  };

  const getMax = (array: number[] | undefined): string => {
    return Math.max(...(array || [])).toString();
  };

  const dateToLocalString = (value: number): string => (value > 10 ? value.toString() : "0" + value);
  const getDayName = (date: Date) => date.toLocaleDateString("pl-PL", { weekday: "long" });

  return (
    <header className="bg-black text-white">
      <div className="container w-full max-w-screen-2xl pt-3 pb-5 px-2 sm:px-10 mx-auto">
        <div className="relative mb-2 w-full flex justify-center items-center flex-col md:flex-row gap-y-3">
          <div className="h-10 w-full md:w-auto md:grow max-w-5xl">
            <Search label="Znajdź lokalizację" />
          </div>
          <div className="mx-4 hidden md:flex items-center w-auto h-16 flex-col">
            <span className="grow w-0.5 bg-white" />
            <span className="p-y-1">Lub</span>
            <span className="grow w-0.5 bg-white" />
          </div>
          <div className="h-24 md:h-10 grow gap-4 w-full md:w-1/3 flex flex-col md:flex-row justify-around max-w-2xl">
            <div className="w-full h-1/2 md:w-auto md:grow md:h-full flex gap-x-3 justify-between">
              <Search width="2/3" label="Szerokość geograficzna" />
              <Search width="2/3" label="Wysokość geograficzna" />
            </div>
            <motion.button initial={{ backgroundColor: "#808080" }} whileHover={{ backgroundColor: "#FFFFFF" }} className="py-2 px-4 rounded md:w-20">
              <FontAwesomeIcon icon={faSearch} />
            </motion.button>
          </div>
        </div>
        <div className="grid lg:grid-cols-[2fr_1fr] grid-rows-[6fr_4fr] gap-y-5">
          <div className="relative bg-glass text-xs md:text-sm px-4 py-2 lg:px-8 rounded">
            {location && forecest && (
              <>
                <h1 className="text-center">
                  <span className="text-4xl font-bold mr-3">{location.name}</span>
                  <span className="text-xl font-semibold">{location.country_code}</span>
                </h1>
                <h2 className="mb-1">{location.country}</h2>
                <h2 className="mb-1">{`${location.admin1} / ${location.admin2}`}</h2>
                <h2 className="mb-1">
                  {`${location.latitude > 0 ? location.latitude + "°W" : location.latitude * -1 + "°E"} 
              ${location.longitude > 0 ? location.longitude + "°N" : location.longitude * -1 + "°S"}`}
                </h2>
                <h2>
                  <FontAwesomeIcon className="text-sky-400" icon={faPeopleGroup} />
                  <span className="ml-2">{Math.round(location.population / 10000)} tyś</span>
                </h2>
                <div className="text-center md:mt-4 sm:absolute sm:right-10 sm:-translate-y-full md:top-1/2 md:-translate-y-1/2">
                  <WeatherCodeIcon weathercode={3} />
                  <span className="text-2xl sm:text-4xl font-bold">{temperature}°C</span>
                </div>
              </>
            )}
          </div>
          <div className="w-full hidden lg:flex justify-evenly row-span-2">
            <div className="w-2/3 h-full py-4 bg-glassDarker flex flex-col justify-between items-center">
              <h2 className="text-3xl text-amber-500 font-bold">{`${dateToLocalString(time.getHours())}:${dateToLocalString(time.getMinutes())}`}</h2>
              <h2 className="text-xl font-bold">{getDayName(time)}</h2>
              <h2 className="text-xl font-bold">{time.toLocaleDateString("pl-PL")}</h2>
            </div>
            <ul className="text-center flex flex-col justify-between">
              <li className="cursor-pointer">Warszawa</li>
              <li className="cursor-pointer">Wrocław</li>
              <li className="cursor-pointer">Kraków</li>
              <li className="cursor-pointer">Łódź</li>
              <li className="cursor-pointer">Poznań</li>
              <li className="cursor-pointer">Gdańsk</li>
            </ul>
          </div>
          <ul className="flex justify-between gap-5">
            <li className="max-w-xs w-full h-full">
              <ParametrSnapshot name="Opady" icon={faCloud} value={getMax(forecest?.hourly.precipitation) + "mm"} />
            </li>
            <li className="max-w-xs w-full h-full hidden sm:block">
              <ParametrSnapshot name="Porywy wiatru" icon={faWind} value={getMax(forecest?.hourly.windspeed_10m) + "km/h"} />
            </li>
            <li className="max-w-xs w-full h-full hidden sm:block">
              <ParametrSnapshot name="Kierunek wiatru" icon={faCompass} value="20mm" />
            </li>
            <li className="max-w-xs w-full h-full">
              <ParametrSnapshot name="Maksymalna temperatura" icon={faTemperatureHigh} value={getMax(forecest?.hourly.temperature_2m) + "°C"} />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
