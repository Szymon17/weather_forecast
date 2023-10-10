import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faSun,
  faCloudSun,
  faSmog,
  faCloudRain,
  faCloudShowersHeavy,
  faSnowflake,
  faCloudMeatball,
  faCloudBolt,
  faTemperatureLow,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC } from "react";

const WeatherCodeIcon: FC<{ weathercode: number }> = ({ weathercode }) => {
  const getIcon = (): IconProp => {
    switch (weathercode) {
      case 0:
        return faSun;
      case 1 || 2:
        return faCloudSun;
      case 3:
        return faCloud;
      case 45 || 48:
        return faSmog;
      case 51 || 53 || 55 || 56 || 57 || 61 || 66 || 67 || 80 || 81 || 82:
        return faCloudRain;
      case 63 || 65:
        return faCloudShowersHeavy;
      case 71 || 73 || 75 || 85 || 86:
        return faSnowflake;
      case 77:
        return faCloudMeatball;
      case 95 || 96 || 99:
        return faCloudBolt;
      default:
        return faTemperatureLow;
    }
  };

  return <FontAwesomeIcon className="text-2xl sm:text-4xl mr-2 inline" icon={getIcon()} />;
};

export default WeatherCodeIcon;
