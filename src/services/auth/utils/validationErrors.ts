import { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  if (!error.issues || error.issues.length === 0) {
    return "Validation error";
  }

  const issue = error.issues[0];
  if (!issue) return "Validation error";

  const field = (issue.path && issue.path[0]?.toString()) || "field";

  switch (issue.code) {
    case "invalid_type":
      return `${field}: expected ${(issue as any).expected}, received ${(issue as any).received}`;
    case "too_small":
      return `${field}: must be at least ${(issue as any).minimum} characters`;
    case "too_big":
      return `${field}: must be at most ${(issue as any).maximum} characters`;
    case "invalid_format":
      if ((issue as any).format === "email") {
        return `${field}: invalid email address`;
      }
      return `${field}: invalid format`;
    default:
      return issue.message || "Validation error";
  }
}
