import { createContext, FC, PropsWithChildren, useState } from "react";
import { location, forecast } from "../types";

type context = {
  location: location | null;
  forecast: forecast | null;
  fetchData: (location: string) => void;
};

const createLocationObject = (res: any): location => {
  console.log(res);
  return {
    name: res.name,
    country: res.country,
    admin1: res.admin1,
    admin2: res.admin2,
    admin3: res.admin3,
    latitude: res.latitude.toFixed(2),
    longitude: res.longitude.toFixed(2),
    country_code: res.country_code,
    population: res.population,
  };
};

const createForecestObject = (res: any): forecast => {
  return {
    latitude: res.latitude.toFixed(2),
    longitude: res.longitude.toFixed(2),
    hourly: res.hourly,
    daily: res.daily,
  };
};

const fetchLocation = async (location: string) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=pl&format=json`);
  const { results } = await res.json();

  return createLocationObject(results[0]);
};

const fetchForecast = async (latitude: number, longitude: number, forecast_days: number = 1) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}8&longitude=${longitude}8&hourly=temperature_2m,precipitation,weathercode,cloudcover,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Europe%2FLondon&forecast_days=${forecast_days}`
  );
  const data = await res.json();

  return createForecestObject(data);
};

export const ForecestContext = createContext<context>({
  location: null,
  forecast: null,
  fetchData: () => null,
});

const ForecastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<location | null>(null);
  const [forecast, setForecast] = useState<forecast | null>(null);

  const fetchData = async (location: string) => {
    const locationData = await fetchLocation(location);
    const forecastData = await fetchForecast(locationData.latitude, locationData.longitude);

    setLocation(locationData);
    setForecast(forecastData);
  };

  const value = { location, forecast, fetchData };

  return <ForecestContext.Provider value={value}>{children}</ForecestContext.Provider>;
};

export default ForecastProvider;
