# paninti — project guide for Claude

Personal tracker for the Panini FIFA World Cup 2026 sticker album. Next.js app,
deployed at https://paninti.jel.be. The collection (owned stickers, duplicates,
extras) is persisted in Upstash Redis and reached through the app's HTTP API.

## Daily sticker workflow (primary use)

The owner uploads photos of stickers in a Claude Code session. When that happens:

1. **Read the codes.** Sticker backs show a code like `MEX 8`, `IRQ 7`, `FWC 13`.
   Fronts show player + club + national flag. Use whichever side is visible.
2. **Map code → sticker id:** `{PREFIX}{n}` → `{prefix-lowercase}-{n}`
   (e.g. `MEX8` → `mex-8`), except special stickers `FWC{n}` → `sp-{n}`.
   Verify the prefix against the `countries` list in `data/stickers.ts` — a few
   printed codes differ from the stored id (e.g. Curaçao prints `CUW` but is
   stored as `cur`).
3. **Compare to the live collection:** `GET https://paninti.jel.be/api/state`.
   `collected` is a map of owned sticker ids; `duplicates` is a map of counts.
4. **Report** which scanned stickers are ✨ new (not in `collected`) vs
   🔁 duplicate (already owned), with player names.
5. **Wait for the owner's explicit confirmation before writing anything.**
6. **On confirmation, update** with the helper:
   ```
   node scripts/collection.mjs collect CODE1 CODE2 ...
   ```
   It re-checks live state and routes each code: missing → new, owned →
   duplicate. Then run `node scripts/collection.mjs get` to confirm.
7. **Extra stickers** (marked "EXTRA STICKER" on the front) are not part of the
   numbered set — add them with:
   ```
   node scripts/collection.mjs extra "Player Name - Country"
   ```

## Helper: scripts/collection.mjs
Talks to the live app API (override target with `PANINTI_URL`, default
`https://paninti.jel.be`). Commands: `get`, `status CODE...`, `collect CODE...`,
`extra "Label"`.

## Storage
`lib/storage.ts` reads/writes the whole state to Upstash Redis (key
`paninti:state`). It accepts either `UPSTASH_REDIS_REST_*` or Vercel's
`KV_REST_API_*` env names, and falls back to a local `stickers-state.json` only
when neither is set (local dev). All API routes go through async
`readState`/`writeState`.

## Important
- **Never store the uploaded photos.** Read them to identify stickers, then let
  them stay only in the chat. Upstash holds collection data only, no images.
- Reaching `paninti.jel.be` requires it on the session's network allowlist
  (set in the Claude Code environment). A `403 Host not in allowlist` means the
  current session cannot reach it — a freshly started session can.
- The app's write API endpoints are not authenticated server-side; the PIN gate
  is client-side only.
