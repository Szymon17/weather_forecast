import { createContext, FC, PropsWithChildren, useState } from "react";
import { location, forecast } from "../types";

type context = {
  location: location | null;
  forecast7days: forecast | null;
  forecast24h: forecast | null;
  fetchData: (location: string) => void;
};

const createLocationObject = (res: any): location => {
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
  };
};

const fetchLocation = async (location: string) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=pl&format=json`);
  const { results } = await res.json();

  return createLocationObject(results[0]);
};

const fetchForecast = async (latitude: number, longitude: number) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}8&longitude=${longitude}8&hourly=temperature_2m,precipitation,weathercode,cloudcover,windspeed_10m&forecast_days=8`
  );
  const data = await res.json();

  return createForecestObject(data);
};

const get24hForecest = (forecastData: forecast): forecast => {
  let hourly: any = {};

  for (const [key, value] of Object.entries(forecastData.hourly)) {
    hourly[key] = value.splice(0, 24);
  }

  return {
    latitude: forecastData.latitude,
    longitude: forecastData.longitude,
    hourly,
  };
};

export const ForecestContext = createContext<context>({
  location: null,
  forecast7days: null,
  forecast24h: null,
  fetchData: () => null,
});

const ForecastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<location | null>(null);
  const [forecast7days, setForecast7days] = useState<forecast | null>(null);
  const [forecast24h, setForecast24h] = useState<forecast | null>(null);

  const fetchData = async (location: string) => {
    const locationData = await fetchLocation(location);
    const forecastData = await fetchForecast(locationData.latitude, locationData.longitude);

    setLocation(locationData);
    setForecast7days(forecastData);
    setForecast24h(get24hForecest(forecastData));
  };

  const value = { location, forecast7days, forecast24h, fetchData };

  return <ForecestContext.Provider value={value}>{children}</ForecestContext.Provider>;
};

export default ForecastProvider;
