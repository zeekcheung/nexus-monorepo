import { userInfo } from "os";

export function getUsername(): string {
  return userInfo().username;
}
