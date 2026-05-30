# md2html

A Markdown compiler for parsing Markdown to pretty HTML.

## Usage

```sh
# Install dependencies
bun install

# Build the package
bun run build

# Link the package globally to use the md2html command
bun link

# Compile a Markdown file
md2html -i README.md -o index.html [-t title]
```

## Options

| Option     | Short | Description                                     |
| ---------- | ----- | ----------------------------------------------- |
| `--input`  | `-i`  | Path to the input Markdown file (**required**). |
| `--output` | `-o`  | Path to the output HTML file (**required**).    |
| `--title`  | `-t`  | Custom title for the HTML document (optional).  |
