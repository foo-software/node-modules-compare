#!/usr/bin/env node
import meow from 'meow';
import { nodeModulesCompare } from '../nodeModulesCompare';

const cli = meow({
  importMeta: import.meta,
  flags: {
    inputChanged: {
      isRequired: true,
      type: 'string',
    },
    inputOriginal: {
      isRequired: true,
      type: 'string',
    },
  },
});

const { inputChanged, inputOriginal } = cli.flags;

nodeModulesCompare({
  inputChanged,
  inputOriginal,
});
