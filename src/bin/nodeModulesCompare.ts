#!/usr/bin/env node
import meow from 'meow';
import { nodeModulesCompare } from '../nodeModulesCompare';


const cli = meow({
  importMeta: import.meta,
  flags: {
    inputFile: {
      isRequired: true,
      type: 'string',
    },
    inputFileWithChanges: {
      type: 'string',
    },
    outputDirectory: {
      type: 'string',
    },
  },
});

const { inputFile, inputFileWithChanges, outputDirectory } = cli.flags;

nodeModulesCompare({
  inputFile,
  inputFileWithChanges,
  outputDirectory,
});