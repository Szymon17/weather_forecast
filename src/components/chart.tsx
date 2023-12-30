import { FC, useRef, useEffect, CanvasHTMLAttributes, useState, UIEvent } from "react";

type chartParams = CanvasHTMLAttributes<HTMLCanvasElement> & {
  values: number[];
  dates: string[];
};

type canvasProperteis = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvas2: HTMLCanvasElement;
  ctx2: CanvasRenderingContext2D;
  step: number;
  borderSize: { x: number; y: number };
  ctxSize: { x: number; y: number };
  chartPattern: number;
  radius: number;
};

const Chart: FC<chartParams> = ({ values, dates, ...props }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ref2 = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ x: 0, y: 0 });

  const min = Math.min(...values) || 1;

  const transferedValues = values.map(value => {
    let newValue = 0;

    if (min < 0) newValue = (min - value) / min;
    else newValue = ((min - value) / min) * -1;

    return Number(newValue.toFixed(2));
  });

  const getCanvasProps = (): canvasProperteis => {
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

    const canvas2 = ref2.current as HTMLCanvasElement;
    const ctx2 = canvas2?.getContext("2d") as CanvasRenderingContext2D;

    const borderSize = { x: canvas.width > 1000 ? 20 : 10, y: canvas.width > 1000 ? 30 : 20 };
    const ctxSize = { x: canvas.width - borderSize.x * 2, y: canvas.height - borderSize.y - borderSize.y / 2 };
    const radius = ctxSize.x / 300;

    const chartPattern = (ctxSize.y - borderSize.y * 3) / Math.max(...transferedValues);
    const step = ctxSize.x / values.length;

    return { canvas, ctx, canvas2, ctx2, borderSize, ctxSize, radius, chartPattern, step };
  };

  const calculatePositon = (value: number, index: number, canvasProps: canvasProperteis) => {
    const { step, borderSize, ctxSize, chartPattern } = canvasProps;

    return {
      x: step * (index + 1) + borderSize.x,
      y: ctxSize.y - value * chartPattern - borderSize.y / 2,
    };
  };

  useEffect(() => {
    const canvas = ref.current;
    const canvas2 = ref2.current;
    const container = containerRef.current;

    if (!canvas || !canvas2 || !container) return;

    let delay = false;

    const observer = new ResizeObserver(() => {
      if ((window.innerWidth > canvas.width + 50 || window.innerWidth < canvas.width - 50) && !delay) {
        delay = true;

        setTimeout(() => {
          delay = false;
          const x = window.innerWidth < 1000 ? 1000 : window.innerWidth - 60;

          canvas.width = x;
          canvas.height = window.innerHeight / 2;

          canvas2.width = x;
          canvas2.height = window.innerHeight / 2;
          setCanvasSize({ x: window.innerWidth, y: window.innerHeight / 2 });

          canvas2.style.left = container.scrollLeft + "px";
        }, 10);
      }
    });

    observer.observe(document.body);
  }, [ref]);

  const drawBorder = (canvasProps: canvasProperteis) => {
    const { canvas, ctx, ctx2, borderSize } = canvasProps;

    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, borderSize.y);
    ctx2.fillRect(0, 0, borderSize.x, canvas.height);
    ctx2.fillRect(canvas.width - borderSize.x, 0, borderSize.x, canvas.height);
    ctx.fillRect(0, canvas.height - borderSize.y / 2, canvas.width, borderSize.y);
    ctx.closePath();
  };

  const drawChart = (x1: number, y1: number, canvasProps: canvasProperteis, i = 1) => {
    const { ctx, radius, ctxSize, borderSize } = canvasProps;
    const value1 = transferedValues[i];

    const { x: x2, y: y2 } = calculatePositon(value1, i, canvasProps);
    ctx.strokeStyle = `rgb(35, 120, 168)`;

    ctx.arcTo(x1, y1, x2, y2, radius);

    if ((values.length > 24 && i % 5 === 0) || values.length <= 24) ctx.fillText(values[i - 1].toString() + "°C", x1, y1 - 15);

    if (i < transferedValues.length - 1) drawChart(x2, y2, canvasProps, i + 1);
    else {
      ctx.lineTo(ctxSize.x + borderSize.x, y2);
      ctx.stroke();
    }
  };

  const drawLines = (canvasProps: canvasProperteis) => {
    const { ctx, borderSize, ctxSize, step } = canvasProps;

    ctx.setLineDash([5, 3]);

    if (ctxSize.x < 700) ctx.font = "8px Arial";

    let x = borderSize.x;
    let y = borderSize.y;

    let index = 1;

    while (x <= ctxSize.x + borderSize.x) {
      ctx.beginPath();
      ctx.moveTo(x, borderSize.y);
      ctx.lineTo(x, ctxSize.y + borderSize.y);
      ctx.stroke();
      ctx.closePath();

      if (dates[index - 1]) {
        const date = new Date(dates[index - 1]);

        let stringDate = "";
        let textX = x;

        if (values.length <= 24) {
          if (ctxSize.x < 600) stringDate = `${date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()}`;
          else stringDate = date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
          textX = x + step / 2;
        } else if (index <= 7) {
          stringDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + index - 1).toLocaleDateString();
          textX = x + ctxSize.x / 7 / 2;
        }

        if (date.getHours() === new Date().getHours()) ctx.fillStyle = "orange";
        else ctx.fillStyle = "white";

        ctx.fillText(stringDate, textX, borderSize.y / 2);

        ctx.fillStyle = "black";
      }

      if (values.length > 24) x += ctxSize.x / 7;
      else if (values.length === 24) x += step;

      index++;
    }

    const yStep = ctxSize.y / 10;

    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(borderSize.x, y);
      ctx.lineTo(ctxSize.x + borderSize.x, y);
      ctx.stroke();
      ctx.closePath();

      y += yStep;
    }

    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (values.length) {
      const canvasProps = getCanvasProps();

      const { ctx, canvas, borderSize, ctxSize } = canvasProps;

      ctx.textAlign = "center";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: startX, y: startY } = calculatePositon(transferedValues[0], 0, canvasProps);

      drawBorder(canvasProps);

      ctx.lineWidth = 0.2;

      drawLines(canvasProps);

      if (ctxSize.x > 1000) ctx.font = "12px arial";
      else ctx.font = "8px arial";
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(borderSize.x, startY);
      drawChart(startX, startY, canvasProps);
      ctx.closePath();
    }
  }, [ref, values, canvasSize]);

  const scrollOverlay = (e: UIEvent) => {
    if (!ref2.current) return;

    ref2.current.style.left = e.currentTarget.scrollLeft + "px";
  };

  return (
    <div ref={containerRef} onScroll={scrollOverlay} className="overflow-x-auto relative">
      <canvas ref={ref2} className="w-full h-full absolute left-0" />
      <div className="min-w-[1000px]">
        <canvas ref={ref} {...props} />
      </div>
    </div>
  );
};

export default Chart;
