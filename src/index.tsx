import * as React from "react";
import { render } from "react-dom";
import fixOrientation from "fix-orientation";
import * as serviceWorker from "./serviceWorker";
import { EPositionY, EPositionX } from "./types";

import {
  drawDotGrid,
  drawImage,
  realWidth,
  positionsY,
  positionsX,
  getRatio,
  getImage
} from "./utils";

import "./styles.css";

let ctx: CanvasRenderingContext2D | null = null;

function App() {
  const paper = React.useRef<HTMLCanvasElement | null>(null);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  const [ratio, setRatio] = React.useState(0);
  const [scaledHeight, setScaledHeight] = React.useState(1000);

  const [image, setImage] = React.useState<HTMLImageElement>();
  const [positionY, setPositionY] = React.useState<EPositionY>(
    EPositionY.center
  );
  const [positionX, setPositionX] = React.useState<EPositionX>(
    EPositionX.center
  );

  React.useEffect(() => {
    if (!paper.current || !boxRef.current) {
      return;
    }

    paper.current.width = realWidth;
    paper.current.height = realWidth;

    const { width, height } = boxRef.current.getBoundingClientRect();

    paper.current.style.width = `${width}px`;
    paper.current.style.height = `${height}px`;

    ctx = paper.current.getContext("2d") as CanvasRenderingContext2D;

    drawDotGrid(ctx);
  }, []);

  const fileChange = (files: FileList | null) => {
    if (!files || !files.length) {
      return;
    }

    var reader = new FileReader();
    reader.onload = (e: any) => {
      fixOrientation(e.target.result, { image: true }, function(fixed: string) {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setRatio(getRatio(img));
        };
        img.src = fixed;
      });
    };
    reader.readAsDataURL(files[0]);
  };

  React.useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawDotGrid(ctx);

    if (image) {
      drawImage(ctx, image, positionY, positionX, scaledHeight);
    }
  }, [image, positionX, positionY, scaledHeight]);

  return (
    <React.Fragment>
      <div className="App">
        <div className="logo">
          <div className="logo-text">gryd.</div>
        </div>
        <div className="box-wrapper">
          <div ref={boxRef} className="box">
            <canvas ref={paper} className="paper" width="400" height="400" />
          </div>
        </div>

        <label className="button button--file">
          + Bild hinzufügen
          <input type="file" onChange={e => fileChange(e.target.files)} />
        </label>

        <div>Seitenverhältnis: {ratio}</div>
        <label>
          scale
          <input
            type="range"
            name="scale"
            step={1}
            value={scaledHeight}
            min={0}
            max={realWidth}
            onChange={e => {
              setScaledHeight(parseFloat(e.target.value));
            }}
          />
          <input
            type="number"
            value={scaledHeight}
            min={0}
            max={realWidth}
            onChange={e => {
              setScaledHeight(parseFloat(e.target.value));
            }}
          />
        </label>

        <div>Vertikale Position:</div>
        {positionsY.map((p, idx) => (
          <label className="label" key={idx}>
            <input
              type="radio"
              value={p}
              name="positionY"
              checked={positionY === p}
              onChange={e => setPositionY(p)}
            />
            {p}
          </label>
        ))}

        <div>XPadding:</div>
        {positionsX.map((p, idx) => (
          <label className="label" key={idx}>
            <input
              type="radio"
              value={p}
              name="positionX"
              checked={positionX === p}
              onChange={e => setPositionX(p)}
            />
            {p}
          </label>
        ))}
        <button
          className="button"
          type="button"
          onClick={() =>
            getImage(
              image as HTMLImageElement,
              positionX,
              positionY,
              scaledHeight
            )
          }
        >
          download
        </button>
      </div>
      <div className="footer">
        <a href="https://konstantingassmann.de/">code: @kgassmann</a>
        <a href="http://floramaxwell.de/">design: @fmaxwell</a>
      </div>
    </React.Fragment>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

serviceWorker.register();
