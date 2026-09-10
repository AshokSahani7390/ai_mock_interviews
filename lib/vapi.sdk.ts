import Vapi from "@vapi-ai/web";

// Suppress harmless internal WebRTC lifecycle notices from triggering Next.js error overlays
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("transport changed to disconnected") ||
      msg.includes("daily-js version") ||
      msg.includes("unsupported input processor")
    ) {
      console.info("[WebRTC Lifecycle]:", ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "vapi-token");