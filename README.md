# react-odp

A naive ODP viewer in React.

## Develop

```bash
npm install
npm start
```

## Generate EPUB (WIP)

```bash
brew install fontforge
brew install mp3val
./src/build/pack.ls <path to the odp>
```

## Notes

* `vtt.js` in `package.json` is necessary for `gen.ls` now,
  but webpack will use `WebVTT` from bower as `vtt.js`.
