import type { FontStyle, FontWeight } from "satori";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

async function loadGoogleFont(
  font: string,
  text: string
): Promise<ArrayBuffer> {
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;

  const css = await (
    await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) throw new Error("Failed to download dynamic font");

  // console.log(resource);
  // console.log(resource[1]);

  const res = await fetch(resource[1]);

  if (!res.ok) {
    throw new Error("Failed to download dynamic font. Status: " + res.status);
  }

  const fonts: ArrayBuffer = await res.arrayBuffer();
  return fonts;
}

async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  // cannot support not-English characters
  // [Failed to download dynamic font. Status: 400 · Issue #349 · satnaing/astro-paper](https://github.com/satnaing/astro-paper/issues/349 )
  // const fontsConfig = [
  //   {
  //     name: "IBM Plex Mono",
  //     font: "IBM+Plex+Mono",
  //     weight: 400,
  //     style: "normal",
  //   },
  //   {
  //     name: "IBM Plex Mono",
  //     font: "IBM+Plex+Mono:wght@700",
  //     weight: 700,
  //     style: "bold",
  //   },
  // ];

  const fontsConfig = [
    {
      name: "Noto Sans SC",
      font: "Noto+Sans+SC",
      weight: 400 as FontWeight,
      style: "normal" as FontStyle,
    },
    {
      name: "Noto Sans SC",
      font: "Noto+Sans+SC:wght@700",
      weight: 700 as FontWeight,
      style: "normal" as FontStyle,
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, font, weight, style }) => {
      const data = await loadGoogleFont(font, text);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

// read font ArrayBuffer
function readFileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
        );
      }
    });
  });
}

async function createFontOptionsByLocal(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const fontPath1 = path.join(
    __dirname,
    "../../resources/",
    "ibm-plex-mono-v19-latin-regular.ttf"
  );
  const fontPath2 = path.join(
    __dirname,
    "../../resources/",
    "ibm-plex-mono-v19-latin-700.ttf"
  );
  const fontData1 = await readFileAsArrayBuffer(fontPath1);
  const fontData2 = await readFileAsArrayBuffer(fontPath2);

  return [
    { name: "IBM Plex Mono", weight: 400, style: "normal", data: fontData1 },
    { name: "IBM Plex Mono", weight: 700, style: "bold", data: fontData2 },
  ];
}

export default loadGoogleFonts;
// export default createFontOptionsByLocal;
