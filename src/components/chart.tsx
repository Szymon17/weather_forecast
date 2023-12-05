import { FC, useRef, useEffect, CanvasHTMLAttributes } from "react";

type chartParams = CanvasHTMLAttributes<HTMLCanvasElement> & {
  values: number[];
};

const Chart: FC<chartParams> = ({ values, ...props }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

    const xborderWidth = 50;
    const yborderWidth = 20;

    const ctxWidth = canvas.width - xborderWidth * 2;
    const ctxHeight = canvas.height - yborderWidth * 2;

    ctx.beginPath();

    ctx.fillRect(0, 0, canvas.width, yborderWidth);
    ctx.fillRect(0, 0, xborderWidth, canvas.height);
    ctx.fillRect(canvas.width - xborderWidth, 0, xborderWidth, canvas.height);
    ctx.fillRect(0, canvas.height - yborderWidth, canvas.width, yborderWidth);

    ctx.closePath();

    const transferedValues = transferValuesToPosttive(values, Math.min(...values));

    const max = Math.max(...transferedValues);
    const min = Math.min(...transferedValues);

    console.log(values);
    console.log(transferedValues);

    const chartPattern = ctxHeight / max;
    const step = ctxWidth / (values.length - 1);
    const beginPoint = calculatePositon(transferedValues[0], 0);

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xborderWidth, beginPoint.y);

    for (let i = 0; i < values.length; i++) {
      const value1 = transferedValues[i];
      const value2 = transferedValues[i + 1] || value1;

      const { x: x1, y: y1 } = calculatePositon(value1, i);
      const { x: x2, y: y2 } = calculatePositon(value2, i + 1);

      ctx.arcTo(x1, y1, x2, y2, 15);

      ctx.strokeStyle = `black`;

      ctx.fillText(values[i].toString(), x1, y1 - 15);
    }

    ctx.stroke();

    function calculatePositon(value: number, index: number) {
      console.log(ctxHeight - value * chartPattern);

      return {
        x: step * (index + 1),
        y: ctxHeight - value * chartPattern + yborderWidth,
      };
    }

    function transferValuesToPosttive(arr: number[], min: number) {
      return arr.map(value => {
        let newValue = 0;

        if (min < 0) newValue = (min - value) / min;
        else newValue = ((min - value) / min) * -1;

        return newValue;
      });
    }
  }, [ref, values]);

  return <canvas ref={ref} {...props} />;
};

export default Chart;
