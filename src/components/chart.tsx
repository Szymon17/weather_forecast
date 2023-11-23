import { FC, useRef, useEffect, CanvasHTMLAttributes } from "react";

type chartParams = CanvasHTMLAttributes<HTMLCanvasElement> & {
  values: number[];
};

const Chart: FC<chartParams> = ({ values, ...props }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

    const ctxWidth = canvas.width;
    const ctxHeight = canvas.height;

    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = (max + min) / 2;

    const upperMultiplier = ctxHeight / max - 5;
    const lowerMultipler = (ctxHeight / 2 / min < 0 ? (ctxHeight / 2 / min) * -1 : ctxHeight / 2 / min) - 5;

    const step = ctxWidth / (values.length - 1);

    console.log(min, lowerMultipler);

    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0);

    values.forEach((value, index) => {
      if (value > avg) {
        ctx.lineTo(step * index, ctxHeight - value * upperMultiplier);
      } else {
        const newValue = value < 0 ? value * -1 : value;
        ctx.lineTo(step * index, 200 + newValue * lowerMultipler);
      }
    });
    ctx.stroke();
  }, [ref, values]);

  return <canvas ref={ref} {...props} />;
};

export default Chart;
