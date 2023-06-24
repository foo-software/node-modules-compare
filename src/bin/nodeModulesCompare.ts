#!/usr/bin/env node
import meow from 'meow';
import getPackage from '../lib/getPackage';
import { nodeModulesCompare } from '../nodeModulesCompare';

const packageContent = await getPackage();
const packageContentParsed = JSON.parse(packageContent);

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

console.log(
  `running ${packageContentParsed.name}@${packageContentParsed.version} ✨`,
);

nodeModulesCompare({
  inputFile,
  inputFileWithChanges,
  outputDirectory,
});