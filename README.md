# `@foo-software/node-modules-compare`

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
node-modules-compare \
  --inputFile '/path/to/input/input-file.json' \
  --inputFileWithChanges '/path/to/input/input-file-with-changes.json' \
  --outputDirectory '/path/to/output'
```

## API

#### API: Options

Either `input` or `inputFile` must be provided.

**Option Interfaces**

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

The input file path relative to current working directory (if not using `input` param).

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

If `true` node module data will be ommitted from the resulting dataset.

```typescript
type shouldOmitNodeModuleData = boolean | undefined;
```

#### API: Response

**Response Interfaces**

The interfaces below are used in the response interface.

```typescript
export interface NodeModuleBundleDependent {
  /** Bundle file or id that depends on the Node module being analyzed */
  bundle: string;

  /** The file paths or ids being used from the Node module being analyzed */
  files: string[];
}

export type NodeModuleBundleDependentCollection = Record<
  string,
  NodeModuleBundleDependent
>;

export interface NodeModuleItem {
  /** Bundles that depend on the Node module being analyzed */
  bundleDependents: NodeModuleBundleDependentCollection;

  /** The file paths or ids being used from the Node module being analyzed */
  files: string[];

  /** The package name of the Node module being analyzed */
  packageName: string;

  /** The total size in bytes of all files being used from the Node module being analyzed */
  size: number;
}

export type NodeModuleCollection = Record<string, NodeModuleItem>;

export interface NodeModuleItemDiff {
  /** The bundle dependents count difference between original and changed */
  bundleDependentCount: number;

  /** The number of files used from the module difference between original and changed */
  fileCount: number;

  /** The package name of the Node module being analyzed */
  packageName: string;

  /** The size in bytes difference between original and changed */
  size: number;
}

export interface NodeModulesDiff {
  /** An array of data representing modules that were added */
  added: NodeModuleItem[];

  /** An array of data representing modules that changed */
  changed: NodeModuleItemDiff[];

  /** An array of data representing modules that were removed */
  removed: NodeModuleItem[];

  /** The total bytes difference between original and changed */
  totalBytes: number;
}
```

The response interface.

```typescript
export interface NodeModulesCompareResult {
  /** The difference between original and changed modules */
  diff?: NodeModulesDiff;

  /** A collection dataset of Node modules and corresponding data */
  nodeModules?: NodeModuleCollection;

  /** A collection dataset of newer modules that may have changed and corresponding data */
  nodeModulesWithChanges?: NodeModuleCollection;

  /** File path the result is written to */
  resultFilePath?: string;
}
```

For examples of the API, see the [tests](./src/nodeModulesCompare.test.ts).

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
