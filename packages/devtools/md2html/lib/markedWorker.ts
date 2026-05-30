import hljs from "highlight.js";
import { marked, type TokensList } from "marked";
import markedAlert from "marked-alert";
import { markedHighlight } from "marked-highlight";

// Set options for marked. See https://marked.js.org/using_advanced#options for documentation
marked.use({
  // Async parse markdown string
  // async: true,
  // Use approved GitHub Flavored Markdown (GFM) specification.
  gfm: true,
});

// Extend marked with extensions
marked.use(
  // Enables GFM alerts, See https://www.npmjs.com/package/marked-alert for documentation
  markedAlert(),
  // Highlight code blocks, See https://www.npmjs.com/package/marked-highlight for documentation
  markedHighlight({
    // Highlight code blocks with highlight.js, See https://www.npmjs.com/package/highlight.js for documentation
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, _info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

declare var self: Worker;

/**
 * marked parsed result
 */
export interface IParseResult {
  html: string;
  tokens: TokensList;
}

// Listen the message from main thread
self.onmessage = async (ev: MessageEvent<string>) => {
  // Receive the markdown string
  const markdown = ev.data;

  // Parse the markdown string to html string
  const html = await marked.parse(markdown);

  // Tokenize the markdown string and return its tokens
  const tokens = marked.lexer(markdown);

  // Send the html string and lexer to main thread
  const result: IParseResult = { html, tokens };
  self.postMessage(result);
};
