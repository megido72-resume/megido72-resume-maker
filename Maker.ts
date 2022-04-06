/// <reference lib="dom"/>
import Utils from "./Utils.ts";

const HIDDEN_FRONT = document.createElement("canvas")
HIDDEN_FRONT.width = 1400
HIDDEN_FRONT.height = 700
const HIDDEN_BACK = document.createElement("canvas")
HIDDEN_BACK.width = 1400
HIDDEN_BACK.height = 700
const MEGIDO_EN = new Map<string, string>();
const MEGIDO_TABLE = new Map<string, string>();

enum DrawTarget {
  HiddenFront,
  RevealedFront
}

function drawText(txt: string, x: number, y: number, w: number, h: number, target = DrawTarget.HiddenFront) {
  drawTextSync(txt, x, y, w, h, target);
  // wait for 1 seconds to load font, and write again. what a dirty hack!!
  setTimeout(() => {
    drawTextSync(txt, x, y, w, h, target);
  }, 1000);
}

function drawTextSync(txt: string, x: number, y: number, w: number, h: number, target: DrawTarget) {
  let ctx: CanvasRenderingContext2D
  if (target == DrawTarget.HiddenFront) {
    ctx = HIDDEN_FRONT.getContext("2d")!
  } else {
    ctx = Utils.canvasContext("#megido_front")
  }
  const margin = 2;
  ctx.clearRect(x - margin, y - margin, w + margin * 2, h + margin * 2);
  ctx.font = h + "px 'Kosugi Maru'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText(txt, x + w / 2, y + h / 2);
}

function drawHeader() {
  drawHeaderSync();
  // wait for 2 seconds to load font, and write again. what a dirty hack!!
  setTimeout(drawHeaderSync, 2000);
}

function drawHeaderSync() {
  const ctx = HIDDEN_FRONT.getContext("2d")!;
  ctx.clearRect(0, 0, 1400, 80);
  const txt = "メギド履歴書";
  ctx.font = 38 + "px 'Mochiy Pop P One'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 7;
  ctx.strokeStyle = "blue";
  ctx.strokeText(txt, 700, 38);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ddccff";
  ctx.fillText(txt, 700, 38);
  const dt = new Date();
  const createdAt = "作成日: " + dt.getFullYear() + "/" + (dt.getMonth() + 1) +
    "/" +
    dt.getDate();
  ctx.font = 24 + "px 'Zen Kurenaido'";
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(createdAt, 1370, 65);
}

document.addEventListener("DOMContentLoaded", () => {
  Utils.addChangeListener("#name", (target) => {
    drawText(target.value, 700, 103, 600, 32);
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
    drawText(target.value, 631, 624, 720, 32);
  });
  Utils.addChangeListener("#money", (target) => {
    const ctx = Utils.canvasContext("#megido_front");
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

  document.querySelectorAll<HTMLInputElement>("#favorite_contents input[type='checkbox']").forEach(function(item){
    item.addEventListener("change", function(ev){
      const ctx = HIDDEN_FRONT.getContext('2d')!;
      const doCheck = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        const img = new Image()
        img.src = "/img/checkbox.png"
        img.onload = function(){
          ctx.drawImage(img, x, y, 35, 35)
        }
      }
      const target = ev.target as HTMLInputElement
      const checked = target.checked;
      switch(target.id){
        case "contents_main":
          if(checked){
            doCheck(ctx, 865, 436)
          }else{
            ctx.clearRect(865, 436, 35, 35)
          }
          break;
        case "contents_event":
          if(checked){
            doCheck(ctx, 1115, 436)
          }else{
            ctx.clearRect(1115, 436, 35, 35)
          }
          break;
        case "contents_pvp":
          if(checked){
            doCheck(ctx, 865, 466)
          }else{
            ctx.clearRect(865, 466, 35, 35)
          }
          break;
        case "contents_daigen":
          if(checked){
            doCheck(ctx, 1115, 466)
          }else{
            ctx.clearRect(1115, 466, 35, 35)
          }
          break;
        case "contents_gacha":
          if(checked){
            doCheck(ctx, 865, 501)
          }else{
            ctx.clearRect(865, 501, 35, 35)
          }
          break;
        case "contents_chara":
          if(checked){
            doCheck(ctx, 1115, 500)
          }else{
            ctx.clearRect(1115, 500, 35, 35)
          }
          break;
        case "contents_reiho":
          if(checked){
            doCheck(ctx, 865, 536)
          }else{
            ctx.clearRect(865, 536, 35, 35)
          }
          break;
        case "contents_raid":
          if(checked){
            doCheck(ctx, 1115, 533)
          }else{
            ctx.clearRect(1115, 533, 35, 35)
          }
          break;
      }
    })
  })



  Utils.addChangeListener("#megidral", (target: HTMLInputElement) => {
    const ctx = Utils.canvasContext("#megido_overlay");
    const x = 538;
    const y = 11;
    const h = 32;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (
      !document.querySelector<HTMLInputElement>("#enable_megidoral")!.checked
    ) {
      return;
    }
    const font = new FontFace("Megidral", "url(/img/Megidral-Regular.ttf)");
    font.load().then((fnt) => {
      // @ts-ignore: FontFaceSet actually has .add() method for most browsers
      document.fonts.add(fnt);
      const txt = target.value;
      ctx.font = h + "px 'Megidral'";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#CCCCCCDD";
      ctx.fillText(txt, x, y);
    });
  });

  Utils.addChangeListener("#megido_image", (target: HTMLInputElement) => {
    const fileData = target.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      const ctx = Utils.canvasContext("#megido_front");
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
      };
    };
    reader.readAsDataURL(fileData);
  });
  Utils.addChangeListener("#enable_megidoral", (_: HTMLInputElement) => {
    const meg = document.querySelector<HTMLInputElement>("#megidral")!;
    meg.dispatchEvent(new Event("change"));
  });
  Utils.addChangeListener(
    "#recommend_megido",
    (target: HTMLInputElement) => {
      const meg = document.querySelector<HTMLInputElement>("#megidral")!;
      const name = MEGIDO_TABLE.get(target.value)!;
      const en_name = MEGIDO_EN.get(name) || "";
      meg.value = en_name;
      meg.dispatchEvent(new Event("change"));

      drawText(name, 150, 555, 380, 32, DrawTarget.RevealedFront);

      const bg = new Image();
      bg.setAttribute("crossorigin", "anonymous");
      bg.src = "/character/character_bg.jpg";
      const ctx = Utils.canvasContext("#megido_front");
      bg.onload = () => {
        ctx.clearRect(6, 6, 537, 537);
        ctx.drawImage(bg, 6, 6, 537, 537);
        const img = new Image();
        img.setAttribute("crossorigin", "anonymous");
        img.src = "/character/" + target.value + ".png";
        img.onload = () => {
          ctx.drawImage(img, 31, 36, 500, 500);
        };
      };
    },
  );
  document.querySelector<HTMLButtonElement>("#gen_image")!.addEventListener(
    "click",
    (_: Event) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 700;
      const ctx = canvas.getContext("2d")!;
      const dx = 22
      const dy = 77
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
        document.querySelector<HTMLCanvasElement>("#megido_back")!,
        dx,
        dy,
      );
      ctx.drawImage(
        document.querySelector<HTMLCanvasElement>("#megido_front")!,
        dx,
        dy,
      );
      ctx.drawImage(
        document.querySelector<HTMLCanvasElement>("#megido_overlay")!,
        dx,
        dy,
      );
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "megido-resume.png";
      link.innerText =
        "このリンクから画像をダウンロードして「#メギド履歴書」「#メギドクラスタと繋がりたい」とかつけてツイートして下さい";
      link.classList.add("download_link");
      const el_result = document.getElementById("image_result")!;
      document.querySelectorAll(".download_link").forEach((el) => {
        el.parentNode!.removeChild(el);
      });
      el_result.appendChild(link);
    },
  );
  document.querySelectorAll("#favorite_contents input[type='checkbox']")
    .forEach((item) => {
      item.addEventListener("change", (ev: Event) => {
        const ctx = Utils.canvasContext("#megido_front");
        const doCheck = (
          ctx: CanvasRenderingContext2D,
          x: number,
          y: number,
        ) => {
          const img = new Image();
          img.src = "/img/checkbox.png";
          img.onload = () => {
            ctx.drawImage(img, x, y, 35, 35);
          };
        };
        const target = ev.target as HTMLInputElement;
        const checked = target.checked;
        switch (target.id) {
          case "contents_main":
            if (checked) {
              doCheck(ctx, 865, 436);
            } else {
              ctx.clearRect(865, 436, 35, 35);
            }
            break;
          case "contents_event":
            if (checked) {
              doCheck(ctx, 1115, 436);
            } else {
              ctx.clearRect(1115, 436, 35, 35);
            }
            break;
          case "contents_pvp":
            if (checked) {
              doCheck(ctx, 865, 466);
            } else {
              ctx.clearRect(865, 466, 35, 35);
            }
            break;
          case "contents_daigen":
            if (checked) {
              doCheck(ctx, 1115, 466);
            } else {
              ctx.clearRect(1115, 466, 35, 35);
            }
            break;
          case "contents_gacha":
            if (checked) {
              doCheck(ctx, 865, 501);
            } else {
              ctx.clearRect(865, 501, 35, 35);
            }
            break;
          case "contents_chara":
            if (checked) {
              doCheck(ctx, 1115, 500);
            } else {
              ctx.clearRect(1115, 500, 35, 35);
            }
            break;
          case "contents_reiho":
            if (checked) {
              doCheck(ctx, 865, 536);
            } else {
              ctx.clearRect(865, 536, 35, 35);
            }
            break;
          case "contents_raid":
            if (checked) {
              doCheck(ctx, 1115, 533);
            } else {
              ctx.clearRect(1115, 533, 35, 35);
            }
            break;
        }
      });
    });

  const container = document.querySelector<HTMLDivElement>(
    "#canvas_container",
  )!;
  const calcLeft = (canvas: HTMLCanvasElement): string => {
    const x = (container.clientWidth - canvas.width) / 2;
    if (x < 0) {
      return "0px";
    } else {
      return `${x}px`;
    }
  };
  const alignCenter = () => {
    ["#megido_back", "#megido_front", "#megido_overlay"].forEach(
      (selector: string) => {
        const canvas = document.querySelector<HTMLCanvasElement>(selector)!;
        canvas.style.left = calcLeft(canvas);
      },
    );
  };
  alignCenter();
  const resizeObserver = new ResizeObserver(alignCenter);
  resizeObserver.observe(container);

  const img = new Image();
  img.src = "/img/recommend_bg.png";
  img.onload = () => {
    const ctx = Utils.canvasContext("#megido_back");
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
});
