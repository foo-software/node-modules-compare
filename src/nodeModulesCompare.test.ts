import { nodeModulesCompare } from './nodeModulesCompare';
import { NodeModulesCompareInputPayload } from './types';

const mockInputBase: NodeModulesCompareInputPayload[] = [
  {
    bundleName: './dist/chunks/abc.js',
    files: {
      'node_modules/react-dom/index.js': {
        size: 227,
      },
      'node_modules/react/cjs/react.production.min.js': {
        size: 5946,
      },
      'node_modules/react-dom/cjs/react-dom.production.min.js': {
        size: 118677,
      },
      'node_modules/prismjs/components/prism-bash.js': {
        size: 5912,
      },
      'node_modules/prismjs/components/prism-core.js': {
        size: 7269,
      },
      'node_modules/prismjs/components/prism-tsx.js': {
        size: 239,
      },
      'node_modules/prismjs/components/prism-clike.js': {
        size: 712,
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
];

const mockInputBase2: NodeModulesCompareInputPayload[] = [
  ...mockInputBase,
  {
    bundleName: './dist/chunks/def.js',
    files: {
      'node_modules/foo/index.js': {
        size: 100,
      },
      'node_modules/react-dom/index.js': {
        size: 227,
      },
      'node_modules/react-dom/cjs/react-dom.production.min.js': {
        size: 118677,
      },
    },
  },
];

const mockInputBase3: NodeModulesCompareInputPayload[] = [
  ...mockInputBase2,
  {
    bundleName: './dist/chunks/def.js',
    files: {
      'node_modules/abc/index.js': {
        size: 200,
      },
    },
  },
];

const mockInput: NodeModulesCompareInputPayload[] = [
  ...mockInputBase3,
  {
    bundleName: './dist/chunks/hij.js',
    files: {
      'node_modules/abc/index.js': {
        size: 200,
      },
    },
  },
];

const mockResult = {
  'react-dom': {
    bundleDependents: {
      './dist/chunks/abc.js': {
        bundle: './dist/chunks/abc.js',
        files: [
          'node_modules/react-dom/cjs/react-dom.production.min.js',
          'node_modules/react-dom/index.js',
        ],
      },
      './dist/chunks/def.js': {
        bundle: './dist/chunks/def.js',
        files: [
          'node_modules/react-dom/cjs/react-dom.production.min.js',
          'node_modules/react-dom/index.js',
        ],
      },
    },
    files: [
      'node_modules/react-dom/cjs/react-dom.production.min.js',
      'node_modules/react-dom/index.js',
    ],
    packageName: 'react-dom',
    size: 118904,
  },
  prismjs: {
    bundleDependents: {
      './dist/chunks/abc.js': {
        bundle: './dist/chunks/abc.js',
        files: [
          'node_modules/prismjs/components/prism-core.js',
          'node_modules/prismjs/components/prism-bash.js',
          'node_modules/prismjs/components/prism-clike.js',
          'node_modules/prismjs/components/prism-tsx.js',
        ],
      },
    },
    files: [
      'node_modules/prismjs/components/prism-core.js',
      'node_modules/prismjs/components/prism-bash.js',
      'node_modules/prismjs/components/prism-clike.js',
      'node_modules/prismjs/components/prism-tsx.js',
    ],
    packageName: 'prismjs',
    size: 14132,
  },
  react: {
    bundleDependents: {
      './dist/chunks/abc.js': {
        bundle: './dist/chunks/abc.js',
        files: ['node_modules/react/cjs/react.production.min.js'],
      },
    },
    files: ['node_modules/react/cjs/react.production.min.js'],
    packageName: 'react',
    size: 5946,
  },
  abc: {
    bundleDependents: {
      './dist/chunks/def.js': {
        bundle: './dist/chunks/def.js',
        files: ['node_modules/abc/index.js'],
      },
      './dist/chunks/hij.js': {
        bundle: './dist/chunks/hij.js',
        files: ['node_modules/abc/index.js'],
      },
    },
    files: ['node_modules/abc/index.js'],
    packageName: 'abc',
    size: 200,
  },
  foo: {
    bundleDependents: {
      './dist/chunks/def.js': {
        bundle: './dist/chunks/def.js',
        files: ['node_modules/foo/index.js'],
      },
    },
    files: ['node_modules/foo/index.js'],
    packageName: 'foo',
    size: 100,
  },
};

describe('nodeModulesCompare', () => {
  it('should return a Node module compare result ', async () => {
    const result = await nodeModulesCompare({
      input: mockInput,
      inputWithChanges: [
        ...mockInputBase,
        {
          bundleName: './dist/chunks/def.js',
          files: {
            'node_modules/foo/index.js': {
              size: 100,
            },
            'node_modules/foo/some-other-module.js': {
              size: 100,
            },
            'node_modules/react-dom/index.js': {
              size: 227,
            },
            'node_modules/react-dom/cjs/react-dom.production.min.js': {
              size: 118677,
            },
          },
        },
        {
          bundleName: './dist/chunks/hij.js',
          files: {
            'node_modules/abc/index.js': {
              size: 200,
            },
            'node_modules/react-dom/index.js': {
              size: 227,
            },
          },
        },
        {
          bundleName: './dist/chunks/klm.js',
          files: {
            'node_modules/foo/index.js': {
              size: 100,
            },
            'node_modules/hi/index.js': {
              size: 100,
            },
          },
        },
      ],
      shouldOmitNodeModuleData: true,
    });
    expect(result).toEqual({
      diff: {
        added: [
          {
            bundleDependents: {
              './dist/chunks/klm.js': {
                bundle: './dist/chunks/klm.js',
                files: ['node_modules/hi/index.js'],
              },
            },
            files: ['node_modules/hi/index.js'],
            packageName: 'hi',
            size: 100,
          },
        ],
        changed: [
          {
            bundleDependentCount: 1,
            fileCount: 0,
            packageName: 'react-dom',
            size: 0,
          },
          {
            bundleDependentCount: -1,
            fileCount: 0,
            packageName: 'abc',
            size: 0,
          },
          {
            bundleDependentCount: 0,
            fileCount: 1,
            packageName: 'foo',
            size: 100,
          },
        ],
        removed: [],
        totalBytes: 200,
      },
    });
  });

  it('should return a Node module compare result without a diff when there is no difference', async () => {
    const result = await nodeModulesCompare({
      input: mockInput,
      inputWithChanges: mockInput,
    });
    expect(result).toEqual({
      nodeModules: mockResult,
      nodeModulesWithChanges: mockResult,
    });
  });
});
