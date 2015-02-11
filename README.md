# react-odp

A naive ODP viewer in React.

## Develop

```bash
npm install
npm start
```

## Generate EPUB (WIP)

```bash
./src/build/pack.ls <book id>
```

## Notes

* `vtt.js` in `package.json` is necessary for `gen.ls` now,
  but webpack will use `WebVTT` from bower as `vtt.js`.
