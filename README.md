# @foo-software/node-modules-compare

A tool to compare imported `node_modules` existence and size from one build to another

## Development

## Running CLI with `ts-node`

```bash
npm run node-modules-compare -- \
  --inputOriginal '../foo/src/docker/foo-nginx/next-js/result.json' \
  --inputChanged '../foo/src/docker/foo-nginx/next-js/result2.json'
```
