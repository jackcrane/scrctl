import OcrWorker from "./handlers/ocr.js";
import fs from "fs";

const startTime = Date.now();
const ocr = new OcrWorker();
await ocr.load();
console.log("OCR Loaded!");
const loadedTime = Date.now();
let r = await ocr.recognize("./screenshot.jpeg");
const recognizedTime = Date.now();
// Find the string "ACK OV" in the image

console.log(
  r.data.blocks[0].paragraphs
    .filter((d) => {
      return d.text === "Registration & packet pick-\n\n";
    })
    .map((d) => {
      return { text: d.text, bbox: d.bbox };
    })
);

const finishedTime = Date.now();

console.log(`
  Loaded: ${loadedTime - startTime}ms
  Recognized: ${recognizedTime - loadedTime}ms
  Finished: ${finishedTime - recognizedTime}ms
  `);

fs.writeFileSync("./output.json", JSON.stringify(r.data.blocks));
console.log("done");
