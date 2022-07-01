import { createWorker } from "tesseract.js";

class OcrWorker {
  #worker = null;
  #ready = false;
  #stage = {
    stageCode: -1,
    message: "Tesseract not loaded. Call `await load()` before anything else.",
  };
  verbose = false;
  constructor(lang = "eng") {
    this.#worker = createWorker({
      logger: (m) => {
        if (this.verbose) console.log(m);
      },
    });
    this.lang = lang;
  }
  async load() {
    this.#ready = false;
    this.#stage = { stageCode: 1, message: "Loading Tesseract" };
    await this.#worker.load();
    this.#stage = { stageCode: 2, message: "Loading Language model" };
    await this.#worker.loadLanguage(this.lang);
    this.#stage = { stageCode: 3, message: "Initializing Language model" };
    await this.#worker.initialize(this.lang);
    this.#stage = { stageCode: 0, message: "Ready" };
    this.#ready = true;
  }
  async recognize(img) {
    const data = await this.#worker.recognize(img);
    return data;
  }
  async terminate() {
    await this.#worker.terminate();
  }

  async setLang(lang) {
    this.lang = lang;
    this.load();
  }
  isReady() {
    return this.#ready;
  }
  stage() {
    return this.#stage;
  }
}

export default OcrWorker;

// (async () => {
//   await worker.load();
//   await worker.loadLanguage("eng");
//   await worker.initialize("eng");
//   const {
//     data: { text },
//   } = await worker.recognize(
//     "https://tesseract.projectnaptha.com/img/eng_bw.png"
//   );
//   console.log(text);
//   await worker.terminate();
// })();
