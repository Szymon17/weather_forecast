import { FC } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type params = {
  icon: IconDefinition;
  name: string;
  value: string;
};

const ParametrSnapshot: FC<params> = ({ icon, name, value }) => {
  return (
    <div className="relative flex flex-col justify-between h-full bg-glassDarker py-2 px-3 rounded shadow-whiteBottom">
      <header className="flex justify-between text-gray-300 ">
        <FontAwesomeIcon icon={icon} className="text-2xl" />
        <span className="font-semibold text-right">{name}</span>
      </header>
      <span className="text-xl font-bold text-center text-amber-600">{value}</span>
    </div>
  );
};

export default ParametrSnapshot;
