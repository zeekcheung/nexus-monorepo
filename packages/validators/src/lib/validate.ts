import type { Context } from "hono";
import type { ZodType } from "zod";

import { ProblemError } from "../schemas/problem";

/**
 * Validates request query parameters against a Zod schema.
 *
 * When validation fails, it will throw a `ProblemError` instance with granular information about the validation issues.
 *
 * @param c - Hono context object
 * @param schema - Zod schema describing the expected query parameters
 * @returns Parsed and typed query parameters
 */
export function validateQuery<T>(c: Context, schema: ZodType<T>): T {
  const result = schema.safeParse(c.req.query());

  if (!result.success) {
    const issue = result.error.issues[0];
    const field = String(issue?.path.at(-1));

    throw new ProblemError({
      type: "https://example.com/errors/validation",
      status: 400,
      title: "Invalid query parameters",
      detail: `${field}: ${issue?.message}`,
      instance: c.req.path,
      extensions: {
        pointer: `/${issue?.path.join("/")}`,
        code: issue?.code,
      },
    });
  }

  return result.data;
}
