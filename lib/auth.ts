const AUTH_CACHE_MS = 5 * 60 * 1000;
let lastAuthTime = 0;

function isRecentlyAuthenticated() {
  return Date.now() - lastAuthTime < AUTH_CACHE_MS;
}
function markAuthenticated() {
  lastAuthTime = Date.now();
}

// Global resolver for the PIN modal
let pinResolver: ((pin: string | null) => void) | null = null;

export function getPinResolver() { return pinResolver; }
export function clearPinResolver() { pinResolver = null; }

function showPinPrompt(): Promise<string | null> {
  return new Promise((resolve) => {
    pinResolver = resolve;
    window.dispatchEvent(new Event("pin-modal-open"));
  });
}

export async function requireAuth(): Promise<boolean> {
  if (isRecentlyAuthenticated()) return true;

  const pin = await showPinPrompt();
  if (!pin) return false;

  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });

  if (!res.ok) {
    // Signal wrong PIN back to modal — re-open with error
    window.dispatchEvent(new CustomEvent("pin-modal-error"));
    return false;
  }

  markAuthenticated();
  return true;
}
