export function renderTemplate(template: string, params: Record<string, any>) {
  // simple {{key|fallback}} support
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)(?:\|([^}]+))?\s*\}\}/g, (_, key, fallback) => {
    const val = params?.[key];
    if (val === undefined || val === null || val === "") return fallback ?? "";
    // basic escaping to prevent HTML injection if used in web UI
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  });
}
