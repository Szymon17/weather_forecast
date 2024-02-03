import { FC, useEffect, useRef, useState, MouseEvent } from "react";
import "./Chart.css";

type chart = {
  values: number[];
  dates: string[];
  type: "day" | "7days";
};

const settings = {
  padding: 0,
  verticalLinesCount: 8,
  fontSize: 14,
  range: 3,
  leftWidth: 50,
  primaryColor: "#282830",
  secondaryColor: "#32323b",
};

const Chart: FC<chart> = ({ values, dates, type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  const [chartHeight, setChartHeight] = useState(0);
  const [refreshCanvas, setRefreshCanvas] = useState(0);
  let touchStartCords = 0;
  let isTouch = false;

  const transformToPositiveValue = (num: number) => (num >= 0 ? num : num * -1);
  const max = Math.max(...values) + settings.range;
  const min = Math.min(...values) - settings.range;

  const positiveValues = values.map(value => value + transformToPositiveValue(min));

  const previewValues = Array.apply(null, Array(settings.verticalLinesCount)).map((__, i) => {
    const diff = max - ((max - min) / (settings.verticalLinesCount - 1)) * i;

    return diff.toFixed(1);
  });

  const getCtxHeight = () => (containerRef.current ? containerRef.current.clientHeight - settings.fontSize : -1);
  const getMultipler = (): number => (canvasRef.current ? getCtxHeight() / (max + transformToPositiveValue(min)) : -1);
  const getCanvasHeight = (): number => (containerRef.current ? containerRef.current.clientHeight - settings.padding : -1);

  const observePageResize = () => {
    let pause = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = containerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const top = topRef.current;

    if (!canvas || !container || !left || !right || pause || !ctx || !top) return;

    const observer = new ResizeObserver(() => {
      if (window.innerWidth >= 1000) {
        canvas.width = container.offsetWidth - left.clientWidth - right.clientWidth;
        top.style.width = container.offsetWidth + "px";
        container.style.width = "100%";
      } else {
        canvas.width = 1000 - settings.leftWidth;
        top.style.width = 1000 + "px";
        container.style.width = 1000 + "px";
      }

      setRefreshCanvas(Math.random());
      canvas.style.marginLeft = left.clientWidth + "px";

      pause = true;
      setTimeout(() => (pause = false), 10);
    });

    observer.observe(document.body);
  };

  useEffect(() => {
    drawCanvas();
  }, [values, refreshCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const height = getCanvasHeight();

    canvas.width = 1000;
    canvas.height = height;

    drawCanvas();
    observePageResize();
  }, [canvasRef]);

  const calculatePosition = (value: number, index: number, ctx: CanvasRenderingContext2D): { x: number; y: number } => {
    const step = ctx.canvas.width / (positiveValues.length - 1);
    const multipler = getMultipler();

    return {
      x: step * index,
      y: ctx.canvas.height - value * multipler - settings.fontSize / 2,
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const height = getCanvasHeight();

    if (!ctx || !canvas) return;

    ctx.fillStyle = settings.primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#858D98";
    ctx.fillStyle = "#858D98";
    ctx.textAlign = "center";

    setChartHeight(height);
    scrollX();
    drawChart(ctx);

    ctx.lineWidth = 0.2;
    ctx.strokeStyle = "white";
    drawLines(ctx);
    ctx.strokeStyle = "#858D98";
  };

  const calculateTextPosition = (oldX: number, oldY: number, index: number): { x: number; y: number } => {
    const y = oldY - 15;
    let x: number;

    if (index > 0 && index < values.length - 1) x = oldX;
    else if (index === 0) x = oldX + 12;
    else x = oldX - 12;

    return { x, y };
  };

  const drawChart = (ctx: CanvasRenderingContext2D) => {
    const { y: startY } = calculatePosition(positiveValues[0], 0, ctx);

    ctx.beginPath();
    ctx.moveTo(0, startY);

    for (let i = 0; i < positiveValues.length; i++) {
      const value1 = positiveValues[i];

      const { x: x1, y: y1 } = calculatePosition(value1, i, ctx);
      const { x: x2, y: y2 } = calculatePosition(value1, i + 1, ctx);

      if (i % 2 === 0 || positiveValues.length === 24) {
        ctx.arcTo(x1, y1, x2, y2, 5);
      }

      if (positiveValues.length === 24 || i % 7 === 0) {
        const { x: textX, y: textY } = calculateTextPosition(x1, y1, i);
        ctx.fillText(values[i].toString() + "°C", textX, textY);
      }
    }
    ctx.stroke();
    ctx.closePath();
  };

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    const verticalLiElement = leftRef.current?.children[0];
    const horizontalLiElement = topRef.current?.children[0];

    if (!verticalLiElement || !horizontalLiElement) return;

    const yStepSize = getCtxHeight() / settings.verticalLinesCount + Math.floor(verticalLiElement.clientHeight / 2);

    for (let i = 0; i < settings.verticalLinesCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, yStepSize * i + settings.fontSize / 2);
      ctx.lineTo(ctx.canvas.width, yStepSize * i + settings.fontSize / 2);
      ctx.stroke();
      ctx.closePath();
    }
    const xStepSize = ctx.canvas.width / dates.length;

    if (values.length > 24) {
      const loopCounts = dates.length / 24;
      const xStepSize = ctx.canvas.width / loopCounts;

      for (let i = 0; i < dates.length; i++) {
        ctx.beginPath();
        ctx.moveTo(xStepSize * i, 0);
        ctx.lineTo(xStepSize * i, ctx.canvas.height);
        ctx.stroke();
        ctx.closePath();
      }
    } else if (values.length === 24) {
      for (let i = 0; i < dates.length; i++) {
        ctx.beginPath();
        ctx.moveTo(xStepSize * i, 0);
        ctx.lineTo(xStepSize * i, ctx.canvas.height);
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  const scrollX = () => {
    const container = scrollContainerRef.current;
    const right = rightRef.current;
    const left = leftRef.current;

    if (!right || !left || !container) return;

    left.style.left = container.scrollLeft + "px";
    right.style.left = container.scrollLeft + container.clientWidth - right.clientWidth + "px";
  };

  const displayTopValue = (date: string): string => {
    let newDate;

    if (type === "day") newDate = new Date(date).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "numeric" });
    else newDate = new Date(date).toLocaleDateString("pl-PL", { month: "short", day: "2-digit" });

    return newDate;
  };

  const startTouch = (e: MouseEvent) => {
    touchStartCords = e.clientX;
    isTouch = true;
  };

  const endTouch = () => (isTouch = false);

  const scrollhandler = (e: MouseEvent) => {
    if (!isTouch) return;

    const diff = touchStartCords - e.clientX;
    touchStartCords = e.clientX;

    e.currentTarget.scrollLeft += diff;
  };

  return (
    <div style={{ padding: settings.padding + "px" }} className="Chart">
      <div
        ref={scrollContainerRef}
        onMouseDown={startTouch}
        onMouseMove={scrollhandler}
        onMouseUp={endTouch}
        onScroll={scrollX}
        className="scroll-container"
      >
        <div style={{ paddingLeft: "50px", backgroundColor: settings.secondaryColor, height: 30 + "px" }} ref={topRef} className="top">
          {dates.map((date, index) => {
            if (type === "day" || (type === "7days" && index % 24 === 0)) return <li key={index}>{displayTopValue(date)}</li>;
          })}
        </div>
        <div style={{ marginTop: settings.padding }} ref={containerRef} className="chart-container">
          <div
            ref={leftRef}
            style={{ height: chartHeight, width: `${settings.leftWidth}px`, backgroundColor: settings.primaryColor }}
            className="left"
          >
            {previewValues.map((value, index) => (
              <li key={index} className="left-value">
                {value + "°C"}
              </li>
            ))}
          </div>
          <div ref={rightRef} style={{ height: chartHeight, width: "5px", backgroundColor: settings.primaryColor }} className="right" />
          <canvas style={{ backgroundColor: settings.primaryColor }} ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
