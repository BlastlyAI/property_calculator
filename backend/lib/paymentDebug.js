const enabled = String(process.env.PAYMENT_DEBUG || "true").toLowerCase() === "true";

export function paymentLog(message, meta = null) {
  if (!enabled) return;
  if (meta) {
    console.log(`[Payment] ${message}`, meta);
    return;
  }
  console.log(`[Payment] ${message}`);
}
