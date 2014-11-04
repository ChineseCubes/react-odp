# react-odp

A naive ODP viewer in React.

## Develop

```bash
npm install
npm start
```

## Generate EPUB (WIP)

```bash
./src/build/pack.ls [book dir] [book dir] ...
```

It will generate `[book dir].epub ...`.

## Notes

* `vtt.js` in `package.json` is necessary for `gen.ls` now,
  but webpack will use `WebVTT` from bower as `vtt.js`.
