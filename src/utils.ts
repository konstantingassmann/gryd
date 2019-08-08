import { EPositionY, EPositionX } from "./types";

export const realY = 40;
export const paddingEqual = 165;
export const paddingLarge = 225;
export const realWidth = 1080;

export const positionsY: Array<EPositionY> = [
  EPositionY.top,
  EPositionY.bottom,
  EPositionY.center
];
export const positionsX: Array<EPositionX> = [
  EPositionX.left,
  EPositionX.right,
  EPositionX.center
];

export const drawDotGrid = (ctx: CanvasRenderingContext2D) => {
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

export const getRatio = (image: HTMLImageElement) => {
  const min = Math.min(image.width, image.height);
  const max = Math.max(image.width, image.height);
  return min / max;
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  positionY: EPositionY,
  positionX: EPositionX,
  targetHeight: number
) => {
  const scale = targetHeight / image.height;
  const targetWidth = image.width * scale;

  let y = realY;

  switch (positionY) {
    case EPositionY.bottom:
      y = ctx.canvas.height - targetHeight - realY;
      break;
    case EPositionY.center:
      y = ctx.canvas.height / 2 - targetHeight / 2;
      break;
  }

  let x = paddingLarge;

  switch (positionX) {
    case EPositionX.right:
      x = ctx.canvas.width - targetWidth - paddingLarge;
      break;
    case EPositionX.center:
      x = ctx.canvas.width / 2 - targetWidth / 2;
      break;
  }

  ctx.drawImage(image, x, y, targetWidth, targetHeight);
};

export const getImage = (
  image: HTMLImageElement,
  positionX: EPositionX,
  positionY: EPositionY,
  scaledHeight: number
) => {
  if (!image) {
    return;
  }

  const imageCanvas = document.createElement("canvas") as HTMLCanvasElement;
  imageCanvas.width = realWidth;
  imageCanvas.height = realWidth;
  const imageCtx = imageCanvas.getContext("2d") as CanvasRenderingContext2D;

  imageCtx.fillStyle = "white";
  imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
  drawImage(imageCtx, image, positionY, positionX, scaledHeight);

  const link = document.createElement("a");
  link.download = `framed-${image.name}`;
  link.href = imageCanvas.toDataURL();
  link.click();
};
