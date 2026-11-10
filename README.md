# Split Check

A simple, beautiful web app to split restaurant checks fairly — inspired by [this concept](https://x.com/benlouisx/status/2119196838159122553).

Tap a person, then tap the items they had. Shared items split equally. Tax and tip are split proportionally based on what each person ordered.

## Features

- Clean iOS-inspired UI
- Assign items to people with one tap
- Automatic equal split for shared dishes
- Proportional tax & tip
- Live totals
- Works great on mobile (add to home screen)

## Usage

Open `index.html` in a browser, or serve the folder with any static server.

Sample receipt from Lucia Trattoria is pre-loaded. Tap people and items to assign.

## Run locally

```bash
# Python
python -m http.server 8000

# Or Node
npx serve
```

Then visit http://localhost:8000

## License

MIT
