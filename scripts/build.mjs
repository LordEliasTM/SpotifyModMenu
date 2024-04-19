import fs from "fs/promises"
import esbuild from "esbuild"
import packageJson from "../package.json" with { type: "json" };

const watch = process.argv.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const commonOptions = {
  logLevel: "info",
  
  format: "iife",
  platform: "browser",
  target: ["esnext"],
  bundle: true,

  loader: {
    ".html": "text",
    ".css": "text",
  },

  entryPoints: [packageJson.main],
}

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  ...commonOptions,
  
  outfile: `build/${packageJson.name}.js`,
}

/** @type {import("esbuild").BuildOptions} */
const buildOptionsUserscript = {
  ...commonOptions,
  
  outfile: `build/${packageJson.name}.userscript.js`,
  banner: {
    js: (await fs.readFile("src/banner.txt")).toString(),
  },
}

if(watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
}
else {
  esbuild.build(buildOptions);
  esbuild.build(buildOptionsUserscript);
}
