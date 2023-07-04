import { InputPayload } from '../types';
import { getModules } from './getModules';

const mockResults: InputPayload[] = [
  {
    bundleName: 'chunks/abc.123.js',
    files: {
      'node_modules/recoil/es/recoil.js': {
        size: 65956,
      },
      '[sourceMappingURL]': {
        size: 57,
      },
      '[unmapped]': {
        size: 99,
      },
      '[EOLs]': {
        size: 1,
      },
    },
  },
  {
    bundleName: 'chunks/efg.456.js',
    files: {
      'node_modules/clsx/dist/clsx.m.js': {
        size: 351,
      },
      'node_modules/react-is/cjs/react-is.production.min.js': {
        size: 2117,
      },
      'node_modules/@babel/runtime/helpers/esm/defineProperty.js': {
        size: 155,
      },
      'node_modules/@material-ui/core/esm/styles/transitions.js': {
        size: 964,
      },
      'node_modules/@babel/runtime/helpers/esm/extends.js': {
        size: 242,
      },
      'node_modules/@material-ui/core/esm/styles/colorManipulator.js': {
        size: 2422,
      },
      'node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js':
        {
          size: 172,
        },
      '[sourceMappingURL]': {
        size: 89,
      },
      '[unmapped]': {
        size: 101,
      },
      '[EOLs]': {
        size: 1,
      },
    },
  },
  {
    bundleName: 'chunks/hij.789.js',
    files: {
      'node_modules/prismjs/components/prism-json.js': {
        size: 450,
      },
      '[no source]': {
        size: 414,
      },
      'node_modules/prismjs/components/prism-jsx.js': {
        size: 2434,
      },
      'node_modules/@material-ui/core/esm/styles/colorManipulator.js': {
        size: 2422,
      },
      'helpers/loadScripts.ts': {
        size: 268,
      },
      'helpers/usePrism.ts': {
        size: 181,
      },
      'node_modules/prismjs/components/prism-typescript.js': {
        size: 1258,
      },
      'node_modules/prismjs/components/prism-graphql.js': {
        size: 2529,
      },
    },
  },
];

describe('getModules', () => {
  it('should return a module collection', () => {
    const result = getModules({
      inputResults: mockResults,
    });
    expect(result).toEqual({
      'node_modules/recoil/es/recoil.js': {
        bundleDependents: ['chunks/abc.123.js'],
        file: 'node_modules/recoil/es/recoil.js',
        size: 65956,
      },
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
      'node_modules/react-is/cjs/react-is.production.min.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/react-is/cjs/react-is.production.min.js',
        size: 2117,
      },
      'node_modules/prismjs/components/prism-typescript.js': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'node_modules/prismjs/components/prism-typescript.js',
        size: 1258,
      },
      'node_modules/@material-ui/core/esm/styles/transitions.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@material-ui/core/esm/styles/transitions.js',
        size: 964,
      },
      'node_modules/prismjs/components/prism-json.js': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'node_modules/prismjs/components/prism-json.js',
        size: 450,
      },
      'node_modules/clsx/dist/clsx.m.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/clsx/dist/clsx.m.js',
        size: 351,
      },
      'helpers/loadScripts.ts': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'helpers/loadScripts.ts',
        size: 268,
      },
      'node_modules/@babel/runtime/helpers/esm/extends.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@babel/runtime/helpers/esm/extends.js',
        size: 242,
      },
      'helpers/usePrism.ts': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'helpers/usePrism.ts',
        size: 181,
      },
      'node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js':
        {
          bundleDependents: ['chunks/efg.456.js'],
          file: 'node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js',
          size: 172,
        },
      'node_modules/@babel/runtime/helpers/esm/defineProperty.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@babel/runtime/helpers/esm/defineProperty.js',
        size: 155,
      },
    });
  });
  it('should return a module collection with only `node_modules`', () => {
    const result = getModules({
      inputResults: mockResults,
      onlyNodeModules: true,
    });
    expect(result).toEqual({
      'node_modules/recoil/es/recoil.js': {
        bundleDependents: ['chunks/abc.123.js'],
        file: 'node_modules/recoil/es/recoil.js',
        size: 65956,
      },
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
      'node_modules/react-is/cjs/react-is.production.min.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/react-is/cjs/react-is.production.min.js',
        size: 2117,
      },
      'node_modules/prismjs/components/prism-typescript.js': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'node_modules/prismjs/components/prism-typescript.js',
        size: 1258,
      },
      'node_modules/@material-ui/core/esm/styles/transitions.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@material-ui/core/esm/styles/transitions.js',
        size: 964,
      },
      'node_modules/prismjs/components/prism-json.js': {
        bundleDependents: ['chunks/hij.789.js'],
        file: 'node_modules/prismjs/components/prism-json.js',
        size: 450,
      },
      'node_modules/clsx/dist/clsx.m.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/clsx/dist/clsx.m.js',
        size: 351,
      },
      'node_modules/@babel/runtime/helpers/esm/extends.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@babel/runtime/helpers/esm/extends.js',
        size: 242,
      },
      'node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js':
        {
          bundleDependents: ['chunks/efg.456.js'],
          file: 'node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js',
          size: 172,
        },
      'node_modules/@babel/runtime/helpers/esm/defineProperty.js': {
        bundleDependents: ['chunks/efg.456.js'],
        file: 'node_modules/@babel/runtime/helpers/esm/defineProperty.js',
        size: 155,
      },
    });
  });
});
