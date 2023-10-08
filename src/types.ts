export type location = {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  population: number;
};

export type forecast = {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloudcover: number[];
    precipitation: number[];
    weathercode: number[];
    windspeed_10m: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
  };
};
