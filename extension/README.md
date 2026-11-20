# Dodx – Manifest V3 Chrome Extension

This folder contains the private Chrome Web Store companion extension for **dodx.shop** (never exposed in the public website UI).

## Architecture & Chrome Web Store Compliance (MV3)

- **No Remotely Hosted Code**: Only pure JSON data is fetched from `https://www.dodx.shop/api/offers.json` (served by `public/api/offers.json`). All `https://` URLs are validated before navigation, and all UI elements are constructed safely using `document.createElement` and `textContent` (zero `innerHTML` or remote script execution).
- **Minimal Permissions**: Uses only `storage`, `alarms`, and `activeTab`, with `host_permissions` restricted strictly to `https://www.dodx.shop/*`.
- **Background Caching & Periodic Sync**: `background.js` caches the JSON catalog in `chrome.storage.local` with a 6-hour TTL and refreshes automatically via `chrome.alarms`.
- **Offline Fallback**: Falls back to cached data in `chrome.storage.local`, or displays a non-affiliate offline notice pointing to `https://www.dodx.shop` if offline on first launch.
- **Affiliate Disclosure**: Clearly displayed in `popup.html` / `popup.css`.

## Local Testing

1. Open `chrome://extensions` in Google Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this `extension/` folder.
