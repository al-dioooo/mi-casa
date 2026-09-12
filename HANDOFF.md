# Mi Casa — handoff

Single-page birthday site for one recipient (Angel), opened on her phone. Built as one static HTML file with an editable `CONFIG` block. This document is for a coding agent picking the work up from here.

**Hard deadline:** the page must be live before 2026-09-13 00:00 GMT+7. The countdown targets that instant.

## Prerequisites

- `index.html` (this repo) — complete and working as of handoff
- `music.mp3` — owner supplies; not in repo
- `photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg` — owner supplies; not in repo
- Static host with an unlisted URL (Netlify Drop or GitHub Pages). No build step, no server, no dependencies.
- Internet at view time for Google Fonts (Fraunces, Press Start 2P). Page degrades to system fonts offline.
- Any local static server for testing, e.g. `python3 -m http.server 8000`

## File layout

```
mi-casa/
├── index.html      all markup, CSS, JS, and CONFIG
├── music.mp3       owner adds
├── photo-1.jpg     owner adds
├── photo-2.jpg     owner adds
├── photo-3.jpg     owner adds
└── HANDOFF.md
```

Do not split `index.html` into multiple files. One file is a deliberate constraint: the owner is not a web developer and hosts by dragging a folder.

## Screen flow

Six `<section class="screen">` elements; exactly one has `.on` at a time. `show(id)` swaps them and scrolls to top. Nothing is persisted — reload returns to screen 1.

```
[1 envelope] ─tap seal (when unlocked)─▶ [2 greet]
                                            │
                              "Continue?" (quiet link, bottom)
                                            ▼
                                        [3 lock] ─correct pw─▶ [4 slots] ─▶ [5 letter] ─▶ [6 end]
                                            │                      │                         │
                                       "Back to your           "or skip ahead"          "Back to the
                                        birthday" → [2]           → [5]                  start" → [2]
```

### Wireframes

Notation: `[ ]` interactive, `( )` non-interactive status.

**1 · Envelope — locked (before 00:00 GMT+7, no `?preview`)**
```
┌──────────────────────────────┐
│                              │
│      ┌────────────────┐      │
│      │ \    ▪stamp  / │      │
│      │   \        /   │      │
│      │     (  A  )    │      │   seal: static, no glow
│      │   for Baby Angel│     │
│      └────────────────┘      │
│                              │
│        05h 12m 41s           │   pixel font, amber
│      Sealed until midnight.  │   serif italic, dim
└──────────────────────────────┘
```

**1 · Envelope — unlocked**
```
│      │     [  A  ]    │      │   seal: amber pulse ring, tappable
│                              │
│  It's your birthday.         │   countdown digits gone
│  Break the seal.             │
```

**1 · Envelope — opening (1.1 s, then → screen 2)**
```
flap rotates up around its top edge; seal scales to 0 and fades; music starts
```

**2 · Greet**
```
┌──────────────────────────────┐
│ Happy birthday,              │   h1 serif 300
│ Mi Casa.                     │
│ lede paragraphs              │
│ ┌──────────┐                 │
│ │ photo-1  │  caption (i)    │   ×3, stacked; missing file →
│ └──────────┘                 │   dashed box "photo-1.jpg goes here"
│ closing paragraphs           │
│                              │
│      [Continue?              │   pixel 9px, dim — must stay
│  There's a second save.]     │   easy to ignore
└──────────────────────────────┘
```

**3 · Lock**
```
│ Load save?                   │   h2 pixel amber
│ This one's locked. The       │
│ password is the night it     │
│ started.                     │
│ [ ________ the date ______ ] │   inputmode=numeric
│ [ Open ]                     │   .btn
│ (Not that one. Think of the  │   .err, only after a wrong try;
│  date.)                      │   input shakes
│      [Back to your birthday] │
```

**4 · Slots**
```
│ Save data                    │
│ Tap one to load it.          │
│ ┌ Slot 1  Empty. Tap to load.┐   amber border, 4px wax shadow
│ ┌ Slot 2  <memory text>     ┐   loaded: pink border, text upright
│ ┌ Slot 3 …                  ┐
│ ┌ Slot 4 …                  ┐
│ ┌ Slot 5 …                  ┐
│       [Read the letter]      │   .btn — appears only when all 5 loaded
│       [or skip ahead]        │   quiet — always present
```

**5 · Letter**
```
│ ┌────────────────────────┐   │   .paper: cream card, dark ink
│ │ Mi Casa,               │   │
│ │ paragraphs…            │   │
│ │       — your player one│   │
│ └────────────────────────┘   │
│       [One more thing]       │
```

**6 · End**
```
│                              │
│ Mi Casa.                     │   names stacked, serif 300,
│ Mi Amor.                     │   vertically centered
│ …                            │
│ The one and only.            │
│                              │
│ I'd give you my save file.   │   pixel, amber
│      [Back to the start]     │
```

## Element visibility

| Element | Visible when |
|---|---|
| Countdown digits | screen 1, before unlock time, no `?preview` |
| "Break the seal" line | screen 1, unlocked |
| Seal pulse animation | `.envelope.unlocked` and not `.open` |
| Mute button (`#mute`) | after first `startMusic()` call, on every screen thereafter |
| Mute button in `.off` state | audio paused, or autoplay rejected |
| Photo dashed placeholder | that `<img>` fired `error` |
| `.err` message | after a wrong password submit, until a correct one |
| "Read the letter" `.btn` | all 5 slots `.loaded` |
| "or skip ahead" | always on screen 4 |

## Behavior rules

**Countdown.** `CONFIG.unlockAt` is an ISO string with explicit offset (`+07:00`). Compare against `Date.now()`; never use the viewer's local midnight. Ticks once per second. Days segment is omitted when 0.

**Unlock.** `unlocked = true` when `Date.now() >= target` or `?preview` is in the query. Only then does the envelope respond to click / Enter / Space. Before that, taps do nothing (no error, no hint change).

**Open.** Guarded by `opened` so it runs once. Adds `.open`, calls `startMusic()` inside the same user gesture (required for autoplay policy), then `show("s-greet")` after 1100 ms.

**Music.** `<audio loop>` with `src = CONFIG.music`, `volume = CONFIG.musicVolume`. `play()` rejection is caught: the mute button still appears, in `.off` state, so the user can start it manually. Mute toggles pause/play and the `.off` class.

**Lock.** On submit: strip all non-digits from the input, check membership in `CONFIG.passwords`. Match → clear error, `show("s-slots")`. Miss → set error text, replay `.shake` (remove class, force reflow, re-add), select input. No attempt limit. No server; the password is in page source and that is accepted.

**Slots.** Each is a `<button>`. First tap adds `.loaded` and swaps the body text for `CONFIG.slots[i]`. Later taps do nothing. When `loaded === CONFIG.slots.length`, `#slots-foot` gets `.on`.

**Navigation.** Any element with `data-go="<screen-id>"` calls `show()` on click. Add new links by using that attribute; don't add per-button handlers.

**Reduced motion.** `prefers-reduced-motion: reduce` disables all animation and transition. The envelope open then jumps straight to screen 2 after the same 1100 ms.

## Styling spec

Tokens are CSS custom properties on `:root`. Reference by name; don't hardcode hex in new rules.

| Token | Value | Role |
|---|---|---|
| `--night` | `#1B1A3A` | page background |
| `--night-2` | `#27265A` | raised surfaces (slots, input, mute) |
| `--ink` | `#F1E9DA` | body text on night |
| `--ink-dim` | `#AFA8C4` | secondary text, quiet links, empty-slot text |
| `--paper` | `#F7E3CF` | envelope, letter card |
| `--paper-2` | `#E8CBA8` | envelope flap and fold shading |
| `--paper-ink` | `#2A2140` | text on paper |
| `--wax` / `--wax-2` | `#B8323C` / `#7E1C25` | seal; hard shadow under `.btn` and `.slot` |
| `--amber` | `#F2B441` | pixel-font accents, borders, countdown |
| `--pink` | `#F5A3B7` | stamp, loaded-slot border, links, error text |

| Font | Var | Use |
|---|---|---|
| Fraunces 300 / 500 / italic | `--serif` | h1, all prose, letter, names, captions, hints |
| Press Start 2P | `--pixel` | countdown, h2, slot labels, buttons, quiet links, final line |

Layout: single column, `max-width: 520px`, centered, `padding: 40px 22px 64px`. Every screen is `min-height: 100dvh` flex column; `.foot` uses `margin-top: auto` to pin bottom links.

Buttons: `.btn` is a 3px amber border with a hard 4px `--wax-2` offset shadow that collapses 2px on `:active`. `.slot` uses the same treatment. `.quiet` is pixel 9px, no border, dim.

## CONFIG reference

All content lives in `const CONFIG` at the top of the `<script>`. Owner edits this block directly.

| Key | Type | Notes |
|---|---|---|
| `unlockAt` | ISO string with offset | keep `+07:00` |
| `music`, `musicVolume` | string, 0–1 | filename relative to `index.html` |
| `envelopeTo` | string | italic line on the envelope |
| `greetTitle` | string | h1 |
| `greetLede`, `greetClose` | string[] | one entry per paragraph |
| `photos` | `{file, caption}[]` | any count; layout is a stacked column |
| `lockHint` | string | shown above the input |
| `passwords` | string[] | digits only; input is normalised to digits before comparison |
| `wrongMsg` | string | |
| `slots` | string[] | any count; "Read the letter" appears when all are loaded |
| `letterSalutation`, `letter`, `signature` | string, string[], string | |
| `names` | string[] | one per line on screen 6 |
| `saveLine` | string | final pixel line |

Strings are inserted with `innerHTML` (paragraph arrays) or `textContent` (single lines). Avoid raw `<` in content.

## Open tasks

1. Owner adds `music.mp3` and three photos to the folder and writes real captions in `CONFIG.photos`. Placeholder captions currently read "Write your caption here."
2. Owner reviews `CONFIG.signature` (`— your player one`) and removes it if it reads as too much.
3. Deploy to an unlisted URL. Verify on a phone at the real URL with and without `?preview`.
4. Generate a QR code for the final URL for the handwritten card.
5. Optional, if time: a `favicon` and `<meta property="og:title">` so a pasted link previews as "Mi Casa" rather than nothing. Keep `<meta name="robots" content="noindex">`.

## Content rules — do not change without the owner

These are deliberate and were discussed with the owner. Preserve them if you touch copy.

- The birthday side (screen 2) stays light. No declarations, no reference to the relationship's past, no mention of the locked section beyond the one quiet link.
- The locked section is reached only through the quiet link at the bottom of screen 2. Never surface it earlier, never make the link prominent, never auto-open it.
- Slots contain memories and observations only. Declarations of love live in the letter, once.
- The letter does not apologise, explain the breakup, promise to change, or ask for a reply. The line "You don't owe me a reply to this" stays.
- Nothing about physical intimacy or private voice anywhere on the site.
- No tracking, analytics, read receipts, reply form, or contact button. The owner has no way of knowing whether it was opened, by design.
- "I'd give you my save file" is the last line. Nothing after it except the back link.

## What is NOT changed by future work

- The six-screen structure and their order.
- Single-file delivery.
- The `CONFIG`-driven content model (an owner with no coding background must be able to edit text safely).
- Password handling stays client-side and forgiving (digit-normalised, multiple accepted forms).
- Music starts only on the seal tap, never on load.
- The countdown's fixed `+07:00` offset.

## Test checklist

```
[ ] python3 -m http.server 8000 → localhost:8000/index.html?preview loads, no console errors
[ ] Without ?preview: countdown shows Xh Ym Zs and decrements; seal does not respond to tap
[ ] With ?preview: seal pulses; tap → flap opens, seal fades, music plays, screen 2 after ~1s
[ ] Network tab: music.mp3, photo-1/2/3.jpg all 200 (once files are present)
[ ] Missing photo shows dashed "photo-N.jpg goes here" box, no broken-image icon
[ ] Mute button appears after open; toggles audio; icon state matches
[ ] Lock: wrong entry shakes + error; "1111111", "11110111", "1111", "11-11 01.11" all open
[ ] Slots: each loads once; "Read the letter" appears only after all 5; "or skip ahead" always works
[ ] Letter renders on paper card; "One more thing" → names screen → save line last
[ ] Every "back" link returns to the screen the wireframe says
[ ] Phone via LAN IP: no horizontal scroll, photos 4:5, text wraps under 80 chars
[ ] Reduced-motion enabled in OS: no animation, flow still completes
[ ] Deployed URL: repeat the ?preview pass on a phone
```
