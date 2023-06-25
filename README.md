# `@foo-software/node-modules-compare`

**DISCLAIMER:** This project is in its early phases and not ready for use.

A tool to compare imported `node_modules` existence and size from one build to another

## Development

## Running CLI with `ts-node`

#### Generate Source Map Output

```bash
source-map-explorer ../foo/src/docker/foo-nginx/next-js/.next/static/**/*.js \
  --json output/result.json \
  --replace 'webpack://_N_E/' --with ''
```

#### Run with `npm`

```bash
npm run node-modules-compare -- \
  --inputFile './output/result.json' \
  --inputFileWithChanges './output/result2.json' \
  --outputDirectory './output'
```
