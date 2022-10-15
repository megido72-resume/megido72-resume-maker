/// <reference lib="dom"/>

import Utils from "./Utils.ts";
import { RgbaStringColorPicker } from "https://unpkg.com/vanilla-colorful@0.6.2/rgba-string-color-picker.js?module";
const FULL_WIDTH = 1400;
const FULL_HEIGHT = 700;
const MEGIDO_WIDTH = 549;
const MEGIDO_HEIGHT = 606;

function createCanvas(
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

const HIDDEN_FRONT = createCanvas(FULL_WIDTH, FULL_HEIGHT);
const HIDDEN_BACK = createCanvas(FULL_WIDTH, FULL_HEIGHT);
const MEGIDO_BACK = createCanvas(MEGIDO_WIDTH, MEGIDO_HEIGHT);
const MEGIDO_FRONT = createCanvas(MEGIDO_WIDTH, MEGIDO_HEIGHT);
const MEGIDO_THUMB = createCanvas(MEGIDO_WIDTH, MEGIDO_HEIGHT);
const MEGIDO_OVERLAY = createCanvas(MEGIDO_WIDTH, MEGIDO_HEIGHT);

const MEGIDO_EN = new Map<string, string>();
const MEGIDO_TABLE = new Map<string, string>();

enum ShowState {
  MegidoFront,
  MegidoThumb,
}
let MEGIDO_SHOW_STATE = ShowState.MegidoFront;
let CAN_I_USE_WEBP = true;

enum DrawTarget {
  HiddenFront,
  MegidoOverlay,
}

async function drawText(
  txt: string,
  x: number,
  y: number,
  w: number,
  h: number,
  isSubset = true,
  target: DrawTarget = DrawTarget.HiddenFront,
) {
  const fontFamily = await new Promise<string>((resolve, _) => {
    if (isSubset) {
      const font = new FontFace(
        "Kosugi Maru Subset",
        "url(/img/Kosugi-Maru-Subset.woff2)",
      );
      font.load().then(() => {
        // @ts-ignore: FontFaceSet actually has .add() method for most browsers
        document.fonts.add(font);
        resolve("Kosugi Maru Subset");
      });
    } else {
      resolve("Kosugi Maru");
    }
  });
  let ctx: CanvasRenderingContext2D;
  if (target == DrawTarget.HiddenFront) {
    ctx = HIDDEN_FRONT.getContext("2d")!;
  } else {
    ctx = MEGIDO_OVERLAY.getContext("2d")!;
  }
  const margin = 2;
  ctx.clearRect(x - margin, y - margin, w + margin * 2, h + margin * 2);
  ctx.font = h + `px '${fontFamily}'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText(txt, x + w / 2, y + h / 2);
}

function showMegidoAsImg(): Promise<void> {
  const canvas = createCanvas(MEGIDO_WIDTH, MEGIDO_HEIGHT);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(MEGIDO_BACK, 0, 0);
  if (MEGIDO_SHOW_STATE == ShowState.MegidoThumb) {
    ctx.drawImage(MEGIDO_THUMB, 0, 0);
  } else {
    ctx.drawImage(MEGIDO_FRONT, 0, 0);
  }
  ctx.drawImage(MEGIDO_OVERLAY, 0, 0);
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        alert("Error: canvas.toBlob cannot create image");
        reject();
      } else {
        const img = document.getElementById("megido_img")! as HTMLImageElement;
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          URL.revokeObjectURL(url);
        };
        img.src = url;
        resolve();
      }
    });
  });
}

function drawHeader() {
  const ctx = HIDDEN_FRONT.getContext("2d")!;
  ctx.clearRect(0, 0, FULL_WIDTH, 80);
  const img = new Image();
  img.src = "/img/title.png";
  img.onload = () => {
    ctx.drawImage(img, 410, 12);
  };
  const font = new FontFace("Zen Kurenaido", "url(/img/Zen-Kurenaido.woff2)");
  font.load().then(() => {
    // @ts-ignore: FontFaceSet actually has .add() method for most browsers
    document.fonts.add(font);
    const dt = new Date();
    const createdAt = "作成日: " + dt.getFullYear() + "/" + (dt.getMonth() + 1) +
      "/" +
      dt.getDate();
    ctx.font = 24 + "px 'Zen Kurenaido'";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(createdAt, 1370, 65);
  });
}

function simpleChangeListeners() {
  Utils.addChangeListener("#name", (target) => {
    drawText(target.value, 700, 103, 600, 32, false);
  });
  Utils.addChangeListener("#howmany_megido", (target) => {
    drawText(target.value, 830, 162, 150, 32);
  });
  Utils.addChangeListener("#howmany_sixstar", (target) => {
    drawText(target.value, 1113, 162, 150, 32);
  });
  Utils.addChangeListener("#player_level", (target) => {
    drawText(target.value, 830, 217, 150, 32);
  });
  Utils.addChangeListener("#play_style", (target) => {
    drawText(target.value, 860, 274, 480, 32);
  });
  Utils.addChangeListener("#main_story", (target) => {
    drawText(target.value, 860, 329, 480, 32);
  });
  Utils.addChangeListener("#favorite_tactics", (target) => {
    drawText(target.value, 860, 385, 480, 30);
  });
  Utils.addChangeListener("#comment", (target) => {
    drawText(target.value, 631, 624, 720, 32, false);
  });
  Utils.addChangeListener("#money", (target) => {
    const ctx = HIDDEN_FRONT.getContext("2d")!;
    ctx.clearRect(1100, 205, 200, 50);
    let x = 0;
    const y = 230;
    if (target.value == "plankton") {
      x = 1142;
    } else if (target.value == "dolphin") {
      x = 1205;
    } else if (target.value == "whale") {
      x = 1268;
    } else {
      return;
    }
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.arc(x, y, 22, 0, 2 * Math.PI);
    ctx.stroke();
  });
}

function favoriteContentListener() {
  document.querySelectorAll<HTMLInputElement>(
    "#favorite_contents input[type='checkbox']",
  ).forEach(function (item) {
    item.addEventListener("change", function (ev) {
      const ctx = HIDDEN_FRONT.getContext("2d")!;
      const doCheck = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        const img = new Image();
        img.src = "/img/checkbox.png";
        img.onload = function () {
          ctx.drawImage(img, x, y, 35, 35);
        };
      };
      const target = ev.target as HTMLInputElement;
      const checked = target.checked;
      const checkOrClear = (x: number, y: number) => {
        if (checked) {
          doCheck(ctx, x, y);
        } else {
          ctx.clearRect(x, y, 35, 35);
        }
      };
      const left1 = 865;
      const left2 = 1115;
      switch (target.id) {
        case "contents_1":
          checkOrClear(left1, 436);
          break;
        case "contents_2":
          checkOrClear(left2, 436);
          break;
        case "contents_3":
          checkOrClear(left1, 468);
          break;
        case "contents_4":
          checkOrClear(left2, 468);
          break;
        case "contents_5":
          checkOrClear(left1, 502);
          break;
        case "contents_6":
          checkOrClear(left2, 502);
          break;
        case "contents_7":
          checkOrClear(left1, 537);
          break;
        case "contents_8":
          checkOrClear(left2, 536);
          break;
      }
    });
  });
}

function drawMegidoFront(stem: string) {
  return new Promise<void>((resolve, _) => {
    const bg = new Image();
    bg.setAttribute("crossorigin", "anonymous");
    bg.src = "/character/character_bg.jpg";
    const ctx = MEGIDO_FRONT.getContext("2d")!;
    bg.onload = () => {
      ctx.clearRect(6, 6, 537, 537);
      ctx.drawImage(bg, 6, 6, 537, 537);
      if (stem) {
        const img = new Image();
        img.setAttribute("crossorigin", "anonymous");
        img.src = `/character/${stem}.png`;
        img.onload = () => {
          ctx.drawImage(img, 21, 21, 520, 520);
          resolve();
        };
      } else {
        resolve();
      }
    };
  });
}

function drawMegidoThumb(stem: string) {
  return new Promise<void>((resolve, _) => {
    const ctx = MEGIDO_THUMB.getContext("2d")!;
    const img = new Image();
    img.setAttribute("crossorigin", "anonymous");
    const ft = CAN_I_USE_WEBP ? "webp" : "jpg";
    img.src = `/thumbnail/${stem}.${ft}`;
    img.onload = () => {
      ctx.clearRect(6, 6, 537, 537);
      ctx.drawImage(img, 6, 6, 537, 537);
      resolve();
    };
  });
}

function drawMegidoListener() {
  async function drawMegidoral(txt: string) {
    const ctx = MEGIDO_OVERLAY.getContext("2d")!;
    ctx.clearRect(0, 0, ctx.canvas.width, 550);
    if (
      !document.querySelector<HTMLInputElement>("#enable_megidoral")!.checked
    ) {
      return;
    }
    const font =
      await (new FontFace("Megidral", "url(/img/Megidral-Regular.ttf)")).load();
    // @ts-ignore: FontFaceSet actually has .add() method for most browsers
    document.fonts.add(font);
    const color =
      document.querySelector<RgbaStringColorPicker>("rgba-string-color-picker")!
        .color;
    let fontSize =
      document.querySelector<HTMLInputElement>("#megidoral_size")!.value;
    ctx.font = fontSize + "px 'Megidral'";
    const pos =
      document.querySelector<HTMLSelectElement>("#megidoral_pos")!.value;
    let x, y;
    switch (pos) {
      case "lower_left":
        x = 11;
        y = 538;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        break;
      case "lower_right":
        x = 538;
        y = 538;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        break;
      case "upper_left":
        x = 11;
        y = 11;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        break;
      case "upper_center":
        x = 275;
        y = 11;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        break;
      case "lower_center":
        x = 275;
        y = 538;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        break;
      default: // upper right
        x = 538;
        y = 11;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        break;
    }
    ctx.fillStyle = color;
    ctx.fillText(txt, x, y);
  }
  Utils.addChangeListener("#megidral", async (target: HTMLInputElement) => {
    await drawMegidoral(target.value);
    showMegidoAsImg();
  });

  Utils.addChangeListener("#megido_image", (target: HTMLInputElement) => {
    if (!target.files?.length) {
      return;
    }
    const fileData = target.files?.item(0)!;
    if (fileData.name) {
      const txtElem = document.querySelector<HTMLSpanElement>(
        "#megido_image_txt",
      )!;
      txtElem.innerText = fileData.name.substring(0, 8);
    }
    const reader = new FileReader();
    reader.onload = () => {
      const ctx = MEGIDO_FRONT.getContext("2d")!;
      ctx.clearRect(6, 6, 537, 537);
      const img = new Image();
      // @ts-ignore: both has same type
      img.src = reader.result;
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        let sx = 0;
        let sy = 0;
        let sw = 0;
        let sh = 0;
        if (h > w) {
          sx = 0;
          sy = (h - w) / 2;
          sw = w;
          sh = w;
        } else {
          sx = (w - h) / 2;
          sy = 0;
          sw = h;
          sh = h;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 6, 6, 537, 537);
        MEGIDO_SHOW_STATE = ShowState.MegidoFront;
        showMegidoAsImg();
      };
    };
    reader.readAsDataURL(fileData);
  });
  Utils.addChangeListener("#enable_megidoral", (_: HTMLInputElement) => {
    const meg = document.querySelector<HTMLInputElement>("#megidral")!;
    meg.dispatchEvent(new Event("change"));
  });
  async function drawMegidoName(name: string, isSubset: boolean) {
    await drawText(name, 150, 555, 380, 32, isSubset, DrawTarget.MegidoOverlay);
  }
  Utils.addChangeListener(
    "#recommend_megido_name",
    async (el: HTMLInputElement) => {
      await drawMegidoName(el.value, false);
      showMegidoAsImg();
    },
  );
  Utils.addChangeListener(
    "#recommend_megido",
    async (target: HTMLInputElement) => {
      const name = MEGIDO_TABLE.get(target.value) || "";
      const en_name = MEGIDO_EN.get(name) || "";

      document.querySelector<HTMLInputElement>("#megidral")!.value = en_name;
      document.querySelector<HTMLInputElement>("#recommend_megido_name")!
        .value = name;

      if (target.value) {
        const imgPromise = drawMegidoThumb(target.value);
        await Promise.all([
          drawMegidoral(en_name),
          drawMegidoName(name, true),
          imgPromise,
        ]);
      } else {
        MEGIDO_THUMB.getContext("2d")?.clearRect(
          0,
          0,
          MEGIDO_WIDTH,
          MEGIDO_HEIGHT,
        );
        MEGIDO_OVERLAY.getContext("2d")?.clearRect(
          0,
          0,
          MEGIDO_WIDTH,
          MEGIDO_HEIGHT,
        );
      }
      MEGIDO_SHOW_STATE = ShowState.MegidoThumb;
      showMegidoAsImg();
    },
  );
  Utils.addChangeListener(
    "#megidoral_pos",
    (_) => {
      document.querySelector<HTMLInputElement>("#megidral")!.dispatchEvent(
        new Event("change"),
      );
    },
  );
  Utils.addChangeListener(
    "#megidoral_size",
    (_) => {
      document.querySelector<HTMLInputElement>("#megidral")!.dispatchEvent(
        new Event("change"),
      );
    },
  );
}

function bottomButtonListener() {
  document.querySelector<HTMLButtonElement>("#toggle_detail_conf")!
    .addEventListener(
      "click",
      (_: Event) => {
        const el = document.querySelector<HTMLDivElement>("#detail_conf")!;
        el.classList.toggle("d-none");
      },
    );
  document.querySelector<HTMLButtonElement>("#gen_image")!.addEventListener(
    "click",
    async (_: Event) => {
      const canvas = createCanvas(FULL_WIDTH, FULL_HEIGHT);
      const ctx = canvas.getContext("2d")!;
      const dx = 22;
      const dy = 77;
      let promise: Promise<void> | null = null;
      if (MEGIDO_SHOW_STATE == ShowState.MegidoThumb) {
        const stem =
          document.querySelector<HTMLSelectElement>("#recommend_megido")!.value;
        promise = drawMegidoFront(stem);
      } else {
        promise = new Promise<void>((resolve, _) => {
          resolve();
        });
      }
      await promise;
      ctx.drawImage(
        HIDDEN_BACK,
        0,
        0,
      );
      ctx.drawImage(
        HIDDEN_FRONT,
        0,
        0,
      );

      ctx.drawImage(
        MEGIDO_BACK,
        dx,
        dy,
      );
      ctx.drawImage(
        MEGIDO_FRONT,
        dx,
        dy,
      );
      ctx.drawImage(
        MEGIDO_OVERLAY,
        dx,
        dy,
      );
      document.querySelector<HTMLElement>("#gen_image_description")!.classList
        .remove("d-none");
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          alert("Error: canvas.toBlob cannot create image");
          return;
        }
        const newImg = document.createElement("img");
        const url = URL.createObjectURL(blob);
        newImg.src = url;
        newImg.alt = "メギド履歴書";
        newImg.style.width = "100%";
        newImg.style.height = "auto";
        newImg.style.maxWidth = `${FULL_WIDTH}px`;
        const el_result = document.getElementById("image_result")!;
        el_result.querySelectorAll("img").forEach((el) => {
          el.parentNode!.removeChild(el);
        });
        el_result.appendChild(newImg);
      });
    },
  );
}

function startUp() {
  const img = new Image();
  img.src = "/img/recommend_bg.png";
  img.onload = () => {
    const ctx = MEGIDO_BACK.getContext("2d")!;
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
    );
  };
  const hiddenBg = new Image();
  hiddenBg.src = "/img/template.png";
  hiddenBg.onload = () => {
    const ctx = HIDDEN_BACK.getContext("2d")!;
    ctx.drawImage(
      hiddenBg,
      0,
      0,
      hiddenBg.width,
      hiddenBg.height,
    );
    drawHeader();
  };
  fetch("/data/megido_eng.csv").then((data) => {
    data.text().then((text) => {
      text.split(/\r?\n/).forEach((line) => {
        const [jp, en] = line.split(/,/);
        if (en) {
          MEGIDO_EN.set(jp, en);
        }
      });
    });
  });
  fetch("/data/megido_list.json").then((data) => {
    data.json().then((json) => {
      const sel = document.querySelector<HTMLSelectElement>(
        "#recommend_megido",
      )!;
      interface megido {
        name: string;
        n: string | null;
        re_n: string | null;
      }
      [["ソロモン", "solomon"], ["シバの女王", "sheva"]].forEach(
        ([ja, fn]) => {
          const opt = document.createElement("option");
          opt.text = ja;
          opt.value = fn;
          sel.add(opt);
          MEGIDO_TABLE.set(fn, ja);
        },
      );

      json.list.forEach((item: megido) => {
        if (item.n) {
          const opt = document.createElement("option");
          opt.text = item.name;
          opt.value = item.n;
          sel.add(opt);
          MEGIDO_TABLE.set(item.n, item.name);
        }
        if (item.re_n) {
          const opt = document.createElement("option");
          opt.text = item.name + " Re";
          opt.value = item.re_n;
          sel.add(opt);
          MEGIDO_TABLE.set(item.re_n, item.name);
        }
      });
    });
  });
}

function colorPicker() {
  const picker = document.querySelector<RgbaStringColorPicker>(
    "rgba-string-color-picker",
  )!;
  picker.addEventListener("color-changed", (_) => {
    document.querySelector<HTMLInputElement>("#megidral")!.dispatchEvent(
      new Event("change"),
    );
  });
}

function checkWebp(feature: string) {
  const kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha:
      "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation:
      "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
  };
  const img = new Image();
  const callback = function (result: boolean) {
    CAN_I_USE_WEBP = result;
  };
  img.onload = function () {
    const result = (img.width > 0) && (img.height > 0);
    callback(result);
  };
  img.onerror = function () {
    callback(false);
  };
  // @ts-ignore: how to solve this?
  img.src = "data:image/webp;base64," + kTestImages[feature];
}

function debugCanvas() {
  const body = document.querySelector<HTMLBodyElement>("body")!;
  const ins = (msg: string) => {
    const div = document.createElement("div");
    div.innerText = msg;
    body.append(div);
  };
  ins("HIDDEN_FRONT");
  body.append(HIDDEN_FRONT);
  ins("HIDDEN_BACK");
  body.append(HIDDEN_BACK);
  ins("MEGIDO_BACK");
  body.append(MEGIDO_BACK);
  ins("MEGIDO_FRONT");
  body.append(MEGIDO_FRONT);
  ins("MEGIDO_THUMB");
  body.append(MEGIDO_THUMB);
  ins("MEGIDO_OVERLAY");
  body.append(MEGIDO_OVERLAY);
}

document.addEventListener("DOMContentLoaded", () => {
  simpleChangeListeners();
  favoriteContentListener();
  drawMegidoListener();
  bottomButtonListener();
  startUp();
  colorPicker();
  checkWebp("lossy");

  //debugCanvas();
});
