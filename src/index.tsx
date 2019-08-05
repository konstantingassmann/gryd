import * as React from "react";
import { render } from "react-dom";
import fixOrientation from "fix-orientation";

import "./styles.css";

const realY = 40;
const paddingEqual = 165;
const paddingLarge = 225;
const realWidth = 1080;

const positionsV: Array<"top" | "bottom"> = ["top", "bottom"];
const positionsH: Array<"left" | "right" | "center"> = [
  "left",
  "right",
  "center"
];

let ctx: CanvasRenderingContext2D | null = null;

const drawDotGrid = (ctx: CanvasRenderingContext2D) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const step = width / 45;
  for (let i = step; i < width; i += step) {
    for (let j = step; j < height; j += step) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.ellipse(i, j, 1, 1, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawImage = (ctx, image, positionV, positionH) => {
  const targetHeight = 1000;
  const scale = targetHeight / image.height;
  const targetWidth = image.width * scale;

  let y = realY;
  if (positionH === "bottom") {
    y = ctx.canvas.height - targetHeight - realY;
  }

  let x = paddingLarge;

  switch (positionH) {
    case "right":
      x = ctx.canvas.width - targetWidth - paddingLarge;
      break;
    case "center":
      x = paddingEqual;
      break;
  }

  ctx.drawImage(image, x, y, targetWidth, targetHeight);
};

function App() {
  const paper = React.useRef<HTMLCanvasElement>();
  const boxRef = React.useRef<HTMLDivElement>();

  const [image, setImage] = React.useState<HTMLImageElement>(null);
  const [positionV, setPositionV] = React.useState<"top" | "bottom">("top");
  const [positionH, setPositionH] = React.useState<"left" | "right" | "center">(
    "left"
  );

  React.useEffect(() => {
    paper.current.width = realWidth;
    paper.current.height = realWidth;

    const { width, height } = boxRef.current.getBoundingClientRect();

    paper.current.style.width = `${width}px`;
    paper.current.style.height = `${height}px`;

    ctx = paper.current.getContext("2d");

    drawDotGrid(ctx);
  }, []);

  const fileChange = (files: FileList) => {
    if (!files.length) {
      return;
    }

    var reader = new FileReader();
    reader.onload = (e: any) => {
      fixOrientation(e.target.result, { image: true }, function(fixed) {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        console.log(fixed);
        img.src = fixed;
      });
    };
    reader.readAsDataURL(files[0]);
  };

  const getImage = () => {
    const imageCanvas = document.createElement("canvas") as HTMLCanvasElement;
    imageCanvas.width = realWidth;
    imageCanvas.height = realWidth;
    const imageCtx = imageCanvas.getContext("2d") as CanvasRenderingContext2D;

    imageCtx.fillStyle = "white";
    imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
    drawImage(imageCtx, image, positionV, positionH);

    const link = document.createElement("a");
    link.download = `framed-${image.name}`;
    link.href = imageCanvas.toDataURL();
    link.click();
  };

  React.useEffect(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawDotGrid(ctx);

    if (image) {
      drawImage(ctx, image, positionV, positionH);
    }
  }, [image, positionH, positionV]);

  return (
    <div className="App">
      <div className="box-wrapper">
        <div ref={boxRef} className="box">
          <canvas ref={paper} className="paper" width="400" height="400" />
        </div>
      </div>
      <input
        className="button"
        type="file"
        onChange={e => fileChange(e.target.files)}
      />
      <button className="button" type="button" onClick={getImage}>
        download
      </button>
      {positionsV.map((p, idx) => (
        <label className="label" key={idx}>
          <input
            type="radio"
            value={p}
            name="positionV"
            checked={positionV === p}
            onChange={e => setPositionV(p)}
          />
          {p}
        </label>
      ))}
      {positionsH.map((p, idx) => (
        <label className="label" key={idx}>
          <input
            type="radio"
            value={p}
            name="positionH"
            checked={positionH === p}
            onChange={e => setPositionH(p)}
          />
          {p}
        </label>
      ))}
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
