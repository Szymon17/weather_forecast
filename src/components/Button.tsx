import { ButtonHTMLAttributes, FC, useEffect, useState } from "react";

export type buttonTypes = "base" | "reverse";

type props = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: buttonTypes;
};

const baseStyles = "transition duration-500 rounded py-2 px-2 2xl:py-2 2xl:px-3 font-semibold text-xl";

const Button: FC<props> = ({ children, buttonType = "base", ...otherProps }) => {
  const [styles, setStyles] = useState(baseStyles);

  const addNewStyles = (newStyles: string) => setStyles(baseStyles + " " + newStyles);

  useEffect(() => {
    switch (buttonType) {
      case "reverse":
        addNewStyles("shadow-full");
        break;

      default:
        addNewStyles("bg-zinc-950 text-white");
        break;
    }
  }, [buttonType]);

  return (
    <button {...otherProps} className={styles}>
      {children}
    </button>
  );
};

export default Button;
