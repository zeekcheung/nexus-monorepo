const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
} as const;

export function log(message: string, color: keyof typeof colors) {
  console.log(`${colors[color]}%s${colors.reset}`, message);
}

export function success(message: string) {
  console.log(`${colors.green}✔ %s${colors.reset}`, message);
}

export function warn(message: string) {
  console.log(`${colors.yellow}⚠ %s${colors.reset}`, message);
}

export function error(message: string) {
  console.log(`${colors.red}❌ %s${colors.reset}`, message);
}

export function info(message: string) {
  console.log(`${colors.blue}ℹ %s${colors.reset}`, message);
}

export function debug(message: string) {
  if (process.env.DEBUG) {
    console.log(`${colors.gray}[🐛] %s${colors.reset}`, message);
  }
}
