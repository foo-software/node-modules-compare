# `@foo-software/node-modules-compare`

**DISCLAIMER:** This project is in its early phases and not ready for use.

A tool to compare imported `node_modules` existence and size from one build to another.

## Prerequisites

- [`source-map-explorer`](https://github.com/danvk/source-map-explorer) is required to provide bundle data being compared. The input of this tool is the output of `source-map-explorer`.

## Install

```bash
npm install @foo-software/node-modules-compare
```

Or install globally for CLI usage:

```bash
npm install -g @foo-software/node-modules-compare
```

## Usage

#### Usage: Node Module

```typescript
import { nodeModulesCompare } from '@foo-software/node-modules-compare';

const logNodeModulesCompareResult = async () => {
  const result = await nodeModulesCompare({
    inputFile: '/path/to/input/input-file.json',
    inputFileWithChanges: '/path/to/input/input-file-with-changes.json',
    shouldOmitNodeModuleData: true,
  });
  console.log('result', result);
};
```

#### Usage: CLI

```bash
node-modules-compare -- \
  --inputFile '/path/to/input/input-file.json' \
  --inputFileWithChanges '/path/to/input/input-file-with-changes.json' \
  --outputDirectory '/path/to/output'
```

#### Usage: Options

Either `input` or `inputFile` must be provided.

**Option interfaces**

The interfaces below are used in various options.

```typescript
interface NodeModulesCompareInputPayload {
  bundleName: string;
  files: Record<string, { size: number }>;
}
```

**`options.input`**

*Only available in Node module*

The input payload (if not using `inputFile`).

```typescript
type input = NodeModulesCompareInputPayload[] | undefined;
```

**`options.inputFile`**

The input file path relative to current working directory (if not using `input` param)

```typescript
type inputFile = string | undefined;
```

**`options.inputFileWithChanges`**

The input file with changes path relative to current working directory (if not using `inputWithChanges` param)

```typescript
type inputFileWithChanges = string | undefined;
```

**`options.inputWithChanges`**

*Only available in Node module*

The input with changes payload (if not using `inputFileWithChanges`)

```typescript
type inputWithChanges = NodeModulesCompareInputPayload[] | undefined;
```

**`options.outputDirectory`**

The output directory path relative to current working directory. If `undefined`, file will not be output.

```typescript
type outputDirectory = string | undefined;
```

**`options.shouldOmitNodeModuleData`**

If `true` node module data will be ommitted from the resulting dataset

```typescript
type shouldOmitNodeModuleData = boolean | undefined;
```

## Development

#### Generate Source Map Output

Below is an example of generating a source map output from a Next.js app using [`source-map-explorer`](https://github.com/danvk/source-map-explorer).

```bash
source-map-explorer ./my-nextjs-app/.next/static/**/*.js \
  --json output/result.json \
  --replace 'webpack://_N_E/' --with ''
```

#### Run with `npm`

The `npm` script runs `ts-node` under the hood.

```bash
npm run node-modules-compare -- \
  --inputFile '/path/to/input/input-file.json' \
  --inputFileWithChanges '/path/to/input/input-file-with-changes.json' \
  --outputDirectory '/path/to/output'
```
