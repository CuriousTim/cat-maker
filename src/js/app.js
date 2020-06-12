"use strict";

// Define aliases to the layer levels to draw; maps to z-index
const CBG = 0;
const CEAR = 1;
const CTAIL = 2;
const CLEG = 3;
const CBODY = 4;
const CFACE = 5;

// ids of the canvas elements 
const LAYER_IDS = ["cbg", "cear", "ctail", "cleg", "cbody", "cface"];

const IPATH = "/images/";

const IMG_SUB_DIRS = [
  "background/",
  "ears/",
  "tail/",
  "legs/",
  "body/",
  "face/"
];

const IMG_NAMES = [
  ["bg1.webp", "bg2.webp"],
  ["ears1.webp", "ears2.webp"],
  ["tail1.webp", "tail2.webp", "tail3.webp"],
  ["legs1.webp", "legs2.webp"],
  ["body1.webp", "body2.webp", "body3.webp"],
  ["face1.webp", "face2.webp"]
];

function CanvasLayer(layerId, imgSubDir, imgNames) {
  this.canvas = document.getElementById(layerId);
  this.context = this.canvas.getContext("2d");
  this.imgPath = IPATH + imgSubDir;
  this.imgNames = imgNames;
  this.currentImgIdx = 0;
  this.img = new Image();
  this.img.src = this.imgPath + (this.imgNames)[this.currentImgIdx];
  this.img.onload = () => { this.context.drawImage(this.img, 0, 0) };
  this.cycle = (left, btn) => {
    if (left && this.currentImgIdx > 0) {
      this.currentImgIdx -= 1;
      if (this.currentImgIdx === 0) {
        btn.disabled = true;
        btn.style.opacity = 0.4;
      }
      // If the left button is clicked, the right button must be enabled
      let otherBtn = document.getElementById("r" + btn.id.slice(1));
      otherBtn.disabled = false;
      otherBtn.style.opacity = 1;

      this.img.src = this.imgPath + (this.imgNames)[this.currentImgIdx];
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.img, 0, 0);
    } else if (!left && this.currentImgIdx < this.imgNames.length - 1) {
      this.currentImgIdx += 1;
      if (this.currentImgIdx === this.imgNames.length - 1) {
        btn.disabled = true;
        btn.style.opacity = 0.4;
      }
      // If the right button is clicked, the left button must be enabled
      let otherBtn = document.getElementById("l" + btn.id.slice(1));
      otherBtn.disabled = false;
      otherBtn.style.opacity = 1;

      this.img.src = this.imgPath + (this.imgNames)[this.currentImgIdx];
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.img, 0, 0);
    }
  };
}

let canvases = new Array(LAYER_IDS.length);
function prepare() {
  for (let i = 0; i < canvases.length; i++) {
    canvases[i] = new CanvasLayer(LAYER_IDS[i], IMG_SUB_DIRS[i], IMG_NAMES[i]);
  }

  let buttons = document.getElementsByTagName("button");
  for (let bt of buttons) {
    switch(bt.id) {
      case 'l-bg':
        bt.onclick = () => {(canvases[CBG].cycle)(true, bt)};
        break;
      case 'r-bg':
        bt.onclick = () => {(canvases[CBG].cycle)(false, bt)};
        break;
      case 'l-face':
        bt.onclick = () => {(canvases[CFACE].cycle)(true, bt)};
        break;
      case 'r-face':
        bt.onclick = () => {(canvases[CFACE].cycle)(false, bt)};
        break;
      case 'l-ear':
        bt.onclick = () => {(canvases[CEAR].cycle)(true, bt)};
        break;
      case 'r-ear':
        bt.onclick = () => {(canvases[CEAR].cycle)(false, bt)};
        break;
      case 'l-body':
        bt.onclick = () => {(canvases[CBODY].cycle)(true, bt)};
        break;
      case 'r-body':
        bt.onclick = () => {(canvases[CBODY].cycle)(false, bt)};
        break;
      case 'l-leg':
        bt.onclick = () => {(canvases[CLEG].cycle)(true, bt)};
        break;
      case 'r-leg':
        bt.onclick = () => {(canvases[CLEG].cycle)(false, bt)};
        break;
      case 'l-tail':
        bt.onclick = () => {(canvases[CTAIL].cycle)(true, bt)};
        break;
      case 'r-tail':
        bt.onclick = () => {(canvases[CTAIL].cycle)(false, bt)};
        break;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", prepare);
} else {
  prepare();
}

/**
 * Merge all canvases onto the background canvas and serve as image
 */
function mergeCanvases() {
  let bgLayer = canvases[CBG];
  for (let i = 1; i < canvases.length; i++) {
    bgLayer.context.drawImage(canvases[i].canvas, 0, 0);         
  }
  let img = bgLayer.canvas.toDataURL("image/png");
  document.getElementById("download").href = img;
  bgLayer.context.clearRect(0, 0, bgLayer.canvas.width, bgLayer.canvas.height);
  bgLayer.context.drawImage(bgLayer.img, 0, 0);
}
document.getElementById("download").onclick = () => {mergeCanvases()};

/**
 * Resize canvas on window resize
 */
window.addEventListener('resize', resize, false);
function resize() {
  let stage = document.getElementById("stage");
  for (let c of canvases) {
    c.canvas.width = stage.clientWidth;
    c.canvas.height = c.canvas.width * 0.75;
    // Resizing image clears canvas
    c.context.drawImage(c.img, 0, 0, c.canvas.width, c.canvas.height);
  }
}

/**
 * Load web worker to preload images.
 */
const ImageLoaderWorker = new Worker('/js/imageLoader.min.js');
for (let c of canvases) {
  // The first image of each layer is already loaded.
  for (let i = 1; i < c.imgNames.length; i++) {
    ImageLoaderWorker.postMessage(c.imgPath + c.imgNames[i]);
  }
}
