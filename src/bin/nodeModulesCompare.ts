#!/usr/bin/env node
import meow from 'meow';
import { getPackage } from '../lib/getPackage.js';
import { nodeModulesCompare } from '../nodeModulesCompare.js';

const packageContent = await getPackage();
const packageContentParsed = JSON.parse(packageContent);

const cli = meow({
  importMeta: import.meta,
  flags: {
    h: {
      type: 'boolean',
    },
    inputFile: {
      type: 'string',
    },
    inputFileWithChanges: {
      type: 'string',
    },
    outputDirectory: {
      type: 'string',
    },
    shouldOmitNodeModuleData: {
      type: 'boolean',
    },
  },
});

const {
  h,
  inputFile,
  inputFileWithChanges,
  outputDirectory,
  shouldOmitNodeModuleData,
} = cli.flags;

const runNodeModulesCompare = async () => {
  console.log(
    `running ${packageContentParsed.name}@${packageContentParsed.version} ✨`,
  );

  const result = await nodeModulesCompare({
    inputFile,
    inputFileWithChanges,
    outputDirectory,
    shouldOmitNodeModuleData,
  });

  if (result.resultFilePath) {
    console.log(` - result path:`, result.resultFilePath);
  }
  if (result.nodeModules) {
    console.log(
      ` - module files analyzed:`,
      Object.keys(result.nodeModules).length,
    );
  }
  if (result.nodeModulesWithChanges) {
    console.log(
      ` - newer module files analyzed:`,
      Object.keys(result.nodeModulesWithChanges).length,
    );
  }

  if (result.diff) {
    console.log(` - a diff was found between builds:`);
    console.log(`   - total bytes diff:`, result.diff.totalBytes);
    console.log(`   - added:`, result.diff.added.length);
    console.log(`   - changed:`, result.diff.changed.length);
    console.log(`   - removed:`, result.diff.removed.length);
  } else if (result.nodeModulesWithChanges) {
    console.log(` - no diff was found`);
  }
};

if (h) {
  console.log(
    `Please refer to GitHub for options:\n` +
      `  https://github.com/foo-software/node-modules-compare/tree/main#usage-options`,
  );
} else {
  runNodeModulesCompare();
}
