
## launch.json

The following snippet can be used in _VS Code_ when debugging tests.

```json5
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/node_modules/.bin/zoroaster",
  "args": [
    "test/spec/integration.js",
    "-a",
    "-w"
  ],
  "env": {
    "ZOROASTER_TIMEOUT": "9999999"
  },
  "console": "integratedTerminal",
  "skipFiles": [
    "<node_internals>/**/*.js"
  ]
}
```
