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
    onlyNodeModules: {
      type: 'boolean',
    },
    outputDirectory: {
      type: 'string',
    },
  },
});

const { inputFile, inputFileWithChanges, onlyNodeModules, outputDirectory } =
  cli.flags;

console.log(
  `running ${packageContentParsed.name}@${packageContentParsed.version} ✨`,
);

const runNodeModulesCompare = async () => {
  const result = await nodeModulesCompare({
    inputFile,
    inputFileWithChanges,
    onlyNodeModules,
    outputDirectory,
  });

  if (result.resultFilePath) {
    console.log(` - result path:`, result.resultFilePath);
  }
  if (result.modules) {
    console.log(
      ` - module files analyzed:`,
      Object.keys(result.modules).length,
    );
  }
  if (result.modulesWithChanges) {
    console.log(
      ` - newer module files analyzed:`,
      Object.keys(result.modulesWithChanges).length,
    );
  }

  if (result.diff) {
    console.log(` - a diff was found between builds:`);
    console.log(`   - total bytes diff:`, result.diff.totalBytes);
    console.log(`   - added:`, result.diff.added.length);
    console.log(`   - changed:`, result.diff.changed.length);
    console.log(`   - removed:`, result.diff.removed.length);
  } else if (result.modulesWithChanges) {
    console.log(` - no diff was found`);
  }
};

runNodeModulesCompare();
