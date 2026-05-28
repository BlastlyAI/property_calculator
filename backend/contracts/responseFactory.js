export function ok(data, meta = {}) {
  return { success: true, data, meta };
}

export function fail(message, code = "INTERNAL_ERROR", details = null) {
  return { success: false, error: { code, message, details } };
}

