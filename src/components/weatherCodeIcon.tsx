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

const defaultCss = "text-2xl sm:text-4xl mr-2";

const WeatherCodeIcon: FC<{ weathercode: number; className?: string }> = ({ weathercode, className }) => {
  const getIcon = (): IconProp => {
    const c = weathercode;

    if (c === 0) return faSun;
    else if (c === 1 || c === 2) return faCloudSun;
    else if (c === 3) return faCloud;
    else if (c === 45 || c === 48) return faSmog;
    else if (c === 51 || c === 53 || c === 55 || c === 56 || c === 57 || c === 61 || c === 66 || c === 67 || c === 80 || c === 81 || c === 82)
      return faCloudRain;
    else if (c === 63 || c === 65) return faCloudShowersHeavy;
    else if (c === 71 || c === 73 || c === 75 || c === 85 || c === 86) return faSnowflake;
    else if (c === 77) return faCloudMeatball;
    else if (c === 95 || c === 96 || c === 99) return faCloudBolt;
    else return faTemperatureLow;
  };

  return <FontAwesomeIcon className={`inline ${className ? className : defaultCss}`} icon={getIcon()} />;
};

export default WeatherCodeIcon;
