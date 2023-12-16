import { FC, useState } from "react";

type Search = {
  label: string;
  width?: string;
  height?: string;
  state: [string, React.Dispatch<React.SetStateAction<string>>];
};

const Search: FC<Search> = ({ state, label, width = "full", height = "full" }) => {
  const [value, setValue] = state;

  return (
    <div className={`relative w-${width} h-${height}`}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`absolute px-3 w-full h-full rounded bg-neutral-700 outline-none border-solid text-white`}
      />
      {!value && (
        <label className="absolute mx-2 left-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-s text-white text-sm lg:text-base">{label}</label>
      )}
    </div>
  );
};

export default Search;
