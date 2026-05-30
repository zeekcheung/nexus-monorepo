// !/usr/bin/bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname, extname, resolve } from "path";
import { parseArgs } from "util";

import { type Tokens } from "marked";
import { success, error } from "shared/logging";

import { type IParseResult } from "../lib/markedWorker";

import githubDarkCSS from "highlight.js/styles/github-dark.css";
import githubLightCSS from "highlight.js/styles/github.css";

// Parse command-line arguments. See https://bun.com/docs/guides/process/argv for documentation
const { values: args } = parseArgs({
  args: Bun.argv,
  options: {
    input: {
      type: "string",
      short: "i",
    },
    output: {
      type: "string",
      short: "o",
    },
    title: {
      type: "string",
      short: "t",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { input, output } = args;

// Check if the arguments are empty
if (!input || !output) {
  error("Usage: md2html -i <input.md> -o <output.html> [-t <title>]");
  process.exit(1);
}

// To prevent ReDoS attacks, run marked on a worker and terminate it when parsing takes longer than usual
const markedWorker = new Worker(new URL("../lib/markedWorker.ts", import.meta.url));
const timeoutLimit = 3000;

// Terminate marked when parsing takes longer than usual
const markedTimeout = setTimeout(() => {
  markedWorker.terminate();
  throw new Error("Mkared took too long!");
}, timeoutLimit);

markedWorker.onmessage = (ev: MessageEvent<IParseResult>) => {
  // Clear the timeout when marked parsed successfully
  clearTimeout(markedTimeout);

  // Get parsed result from marked
  const { html: content, tokens } = ev.data;

  // Check if title exists
  let title = "";

  try {
    const h1 = tokens.find((t): t is Tokens.Heading => t.type === "heading" && t.depth === 1);
    title = args.title ?? h1?.text ?? basename(input, extname(input));
  } catch (err) {
    error("Cannot parse the title from arguments, input header and filename.");
    error(JSON.stringify(err));
    process.exit(1);
  }

  // Render the title and content into the html template
  const fileURL = new URL("../lib/template.html", import.meta.url);
  const template = readFileSync(fileURL, "utf8");
  const html = template
    .replace("{{title}}", title)
    .replace("{{content}}", content)
    .replace("/* __DARK_CSS__ */", githubDarkCSS)
    .replace("/* __LIGHT_CSS__ */", githubLightCSS);

  // Write the html string to the output file
  const outputPath = resolve(output);
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(outputPath, html, "utf8");

  success("Compiled successfully. ");
  console.log(`Check ${outputPath}`);

  // Terminates the markedWorker
  markedWorker.terminate();
};

// Read the markdown string from input file
const markdownString = readFileSync(resolve(input), "utf8");

// Send a message to markedWorker to parse the markdown string to html string
markedWorker.postMessage(markdownString);

// Handle the error of markedWorker
markedWorker.onerror = (err) => {
  error("Marked worker error:");
  error(JSON.stringify(err));
  process.exit(1);
};
