import { ModuleCollection } from '../types';
import { getNodeModules } from './getNodeModules';

const modules: ModuleCollection = {
  'node_modules/prismjs/components/prism-graphql.js': {
    bundleDependents: ['chunks/hij.789.js'],
    file: 'node_modules/prismjs/components/prism-graphql.js',
    size: 2529,
  },
  'node_modules/prismjs/components/prism-jsx.js': {
    bundleDependents: ['chunks/hij.789.js'],
    file: 'node_modules/prismjs/components/prism-jsx.js',
    size: 2434,
  },
  'node_modules/@material-ui/core/esm/styles/colorManipulator.js': {
    bundleDependents: ['chunks/efg.456.js', 'chunks/hij.789.js'],
    file: 'node_modules/@material-ui/core/esm/styles/colorManipulator.js',
    size: 2422,
  },
};

describe('getModules', () => {
  it('should return a Node module collection dataset', () => {
    const result = getNodeModules({
      modules,
    });
    expect(result).toEqual({
      prismjs: {
        bundleDependents: {
          'chunks/hij.789.js': {
            bundle: 'chunks/hij.789.js',
            files: [
              'node_modules/prismjs/components/prism-graphql.js',
              'node_modules/prismjs/components/prism-jsx.js',
            ],
          },
        },
        files: [
          'node_modules/prismjs/components/prism-graphql.js',
          'node_modules/prismjs/components/prism-jsx.js',
        ],
        packageName: 'prismjs',
        size: 4963,
      },
      '@material-ui/core': {
        bundleDependents: {
          'chunks/efg.456.js': {
            bundle: 'chunks/efg.456.js',
            files: [
              'node_modules/@material-ui/core/esm/styles/colorManipulator.js',
            ],
          },
          'chunks/hij.789.js': {
            bundle: 'chunks/hij.789.js',
            files: [
              'node_modules/@material-ui/core/esm/styles/colorManipulator.js',
            ],
          },
        },
        files: [
          'node_modules/@material-ui/core/esm/styles/colorManipulator.js',
        ],
        packageName: '@material-ui/core',
        size: 2422,
      },
    });
  });
});
