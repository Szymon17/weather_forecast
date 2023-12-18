import { useContext, useEffect, useRef, useState } from "react";
import { ForecestContext } from "../context/forecast.context";
import Button from "./Button";
import Chart from "./chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faTable } from "@fortawesome/free-solid-svg-icons";

type predictionTypes = "day" | "7days";
type hoverStateType = "day" | "7days" | null;
type displayType = "chart" | "table";

const Prediction = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [temperatures, setTemperatures] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [predictionType, setPredictionType] = useState<predictionTypes>("day");
  const [hoverState, setHoverState] = useState<hoverStateType>(null);
  const [displayType, setDisplayType] = useState<displayType>("chart");

  const { forecast24h, forecast7days } = useContext(ForecestContext);
  const changeDisplayStyle = () => {
    if (displayType === "table") setDisplayType("chart");
    else setDisplayType("table");
  };

  useEffect(() => {
    if (!forecast7days || !forecast24h) return;

    if (predictionType === "day") {
      setTemperatures(forecast24h.hourly.temperature_2m);
      setDates(forecast24h.hourly.time);
    } else {
      setTemperatures(forecast7days.hourly.temperature_2m);
      setDates(forecast7days.hourly.time);
    }
  }, [predictionType, forecast7days]);

  return (
    <main className="sm:mx-10 pt-5 h-1/2 grow flex flex-col">
      <div className="2xl:mx-40 relative flex gap-10 justify-center lg:text-xl 2xl:text-3xl mb-2">
        <Button
          onMouseEnter={() => setHoverState("day")}
          onMouseLeave={() => setHoverState(null)}
          name="day"
          onClick={() => setPredictionType("day")}
          buttonType={predictionType === "day" || hoverState === "day" ? "base" : "reverse"}
        >
          Prognoza pogody na dziś
        </Button>
        <Button
          name="7days"
          onMouseEnter={() => setHoverState("7days")}
          onMouseLeave={() => setHoverState(null)}
          onClick={() => setPredictionType("7days")}
          buttonType={predictionType === "7days" || hoverState === "7days" ? "base" : "reverse"}
        >
          Prognoza pogody na 7dni
        </Button>
        <FontAwesomeIcon
          className="absolute md:h-full right-5 -bottom-12 md:right-0 md:top-0 cursor-pointer"
          icon={displayType === "chart" ? faTable : faChartLine}
          onClick={changeDisplayStyle}
        />
      </div>
      <div ref={chartContainerRef} className="w-full grow">
        {chartContainerRef.current && forecast7days && displayType === "chart" && (
          <Chart className="border-black border-2 w-full h-full overflow-hidden" dates={dates} values={temperatures} />
        )}
        {forecast7days && displayType === "table" && (
          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere dolore, expedita ullam corporis nobis est ab fugiat, magni soluta
            asperiores suscipit ex repellendus voluptas amet tempore dicta! Nemo assumenda ipsum maxime adipisci doloribus consequuntur illo vel
            praesentium, ut numquam nostrum, dolores deserunt id quas. Possimus at pariatur id consequuntur quae, molestiae quam. Provident, corporis
            eum. Nulla ratione sequi placeat sint, quibusdam amet deleniti ducimus repudiandae harum voluptate, pariatur consequatur eligendi nostrum
            magnam veniam. Aspernatur consectetur recusandae excepturi aliquid soluta dignissimos cupiditate, hic natus dolore? Neque nesciunt odit
            atque ab ducimus voluptatibus a! Voluptate obcaecati accusantium magnam, magni sapiente tenetur quisquam perspiciatis, doloribus,
            molestias eum impedit corporis inventore tempore accusamus dolorum. Explicabo ab labore impedit, quos molestiae deserunt vero quo atque
            rerum neque nulla a soluta odio iure consectetur, ex reiciendis blanditiis distinctio debitis totam. Corrupti quos dolor saepe rem veniam
            quasi totam fugit error ea. Maxime ipsa repudiandae adipisci consequatur? Illum nulla, molestiae in rem sed odit sit quo enim praesentium
            veniam omnis aliquam adipisci expedita officia a deserunt laudantium incidunt voluptates culpa blanditiis molestias natus itaque eligendi
            quaerat. Assumenda deserunt eius beatae dignissimos natus eos delectus adipisci quod perferendis obcaecati nesciunt ullam hic pariatur
            numquam repudiandae impedit architecto totam aspernatur, sint veritatis quis repellat. Aliquam, repudiandae illo dignissimos quibusdam
            omnis, quo rem laboriosam cupiditate, nisi tempore nihil? Cumque, consequuntur corrupti nisi est suscipit maxime accusantium cum
            repellendus numquam laudantium placeat porro ex dolores temporibus deleniti ullam sequi recusandae dolorem accusamus tenetur expedita
            fugiat debitis veritatis? Reprehenderit, itaque reiciendis. Iusto eveniet minima voluptatum dolorem dolor incidunt fuga commodi modi quasi
            fugiat, numquam architecto assumenda sequi tempore veritatis ullam corrupti odit, tempora, maxime officia ducimus. Dolorem repellendus
            asperiores expedita dolorum mollitia, aliquam facere corrupti error earum modi rem ipsa laborum iure vero perspiciatis vitae iste, ex
            beatae eligendi, illo incidunt. Dolores quis et fugiat ea delectus aliquid, quasi nobis harum labore, quos consequatur repellendus
            similique voluptatibus voluptates. Nobis quaerat quibusdam dolorum voluptates facilis quod atque laboriosam, veniam, cumque modi sed
            impedit labore tenetur optio ullam doloribus saepe! Aspernatur nostrum ipsum fugit sint exercitationem sunt harum saepe adipisci aliquid
            labore repudiandae nisi sit nihil earum ut laboriosam delectus suscipit, minus deleniti. Quibusdam laudantium consequatur minus. Repellat
            voluptas libero veniam! Repellendus ut soluta nihil nemo dicta in reprehenderit exercitationem tempora autem fuga sequi dolores dolor ipsa
            quae nostrum, quis tenetur commodi optio placeat ex laboriosam ipsam eveniet consequuntur incidunt! Blanditiis est obcaecati sint? Maxime
            beatae nesciunt tenetur. Quas eaque vel ducimus, sint cupiditate saepe aut dolores vitae tenetur fugiat quasi nihil obcaecati debitis
            reiciendis laboriosam, asperiores maxime impedit velit, beatae autem deleniti maiores ad omnis. A ullam repellat eligendi vitae minima
            animi odio unde quod voluptas quam id delectus, culpa pariatur doloremque. Atque vel debitis dolores aliquam. Similique, deserunt! Hic
            fuga aliquam eum ratione repudiandae. Asperiores nihil blanditiis enim tempore, porro sapiente tenetur vel nostrum consectetur quasi
            incidunt aliquam nisi repellendus? Consequatur molestias earum fugit? Delectus architecto fugiat, a consectetur error saepe sed dicta
            nulla placeat reprehenderit, nisi beatae vitae. Iure, accusantium tenetur?
          </div>
        )}
      </div>
    </main>
  );
};

export default Prediction;
