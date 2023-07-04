import { NodeModuleCollection } from '../types';
import { getNodeModuleCollectionDiff } from './getNodeModuleCollectionDiff';

const moduleCollectionWithRemoved: NodeModuleCollection = {
  foo: {
    bundleDependents: {
      'chunks/abc.js': {
        bundle: 'chunks/abc.js',
        files: ['node_modules/foo/my/great/module.js'],
      },
    },
    files: ['node_modules/foo/my/great/module.js'],
    packageName: 'foo',
    size: 200,
  },
  bar: {
    bundleDependents: {
      'chunks/def.js': {
        bundle: 'chunks/def.js',
        files: ['node_modules/bar/my/great/module.js'],
      },
    },
    files: ['node_modules/bar/my/great/module.js'],
    packageName: 'bar',
    size: 300,
  },
};

const baseModuleCollection: NodeModuleCollection = {
  ...moduleCollectionWithRemoved,
  '@foo/baz': {
    bundleDependents: {
      'chunks/hij.js': {
        bundle: 'chunks/hij.js',
        files: ['node_modules/@foo/baz/my/great/module.js'],
      },
    },
    files: ['node_modules/@foo/baz/my/great/module.js'],
    packageName: '@foo/baz',
    size: 500,
  },
};

const moduleCollectionWithAdded: NodeModuleCollection = {
  ...baseModuleCollection,
  zot: {
    bundleDependents: {
      'chunks/klmn.js': {
        bundle: 'chunks/klmn.js',
        files: ['node_modules/zot/my/great/module.js'],
      },
    },
    files: ['node_modules/zot/my/great/module.js'],
    packageName: 'zot',
    size: 500,
  },
};

const moduleCollectionWithAddedAndChangedAndRemoved: NodeModuleCollection = {
  // changed `size` - 100
  foo: {
    bundleDependents: {
      'chunks/abc.js': {
        bundle: 'chunks/abc.js',
        files: ['node_modules/foo/my/great/module.js'],
      },
    },
    files: ['node_modules/foo/my/great/module.js'],
    packageName: 'foo',
    size: 100,
  },
  // changed `size` + 200, `bundleDependents` + 1
  bar: {
    bundleDependents: {
      'chunks/def.js': {
        bundle: 'chunks/def.js',
        files: ['node_modules/bar/my/great/module.js'],
      },
      'chunks/defg.js': {
        bundle: 'chunks/defg.js',
        files: ['node_modules/bar/my/great/module.js'],
      },
    },
    files: ['node_modules/bar/my/great/module.js'],
    packageName: 'bar',
    size: 500,
  },
  // removed is `baz`
  // added
  abc: {
    bundleDependents: {
      'chunks/klmn.js': {
        bundle: 'chunks/klmn.js',
        files: ['node_modules/abc/my/great/module.js'],
      },
    },
    files: ['node_modules/abc/my/great/module.js'],
    packageName: 'abc',
    size: 500,
  },
  def: {
    bundleDependents: {
      'chunks/ipsum.js': {
        bundle: 'chunks/ipsum.js',
        files: ['node_modules/def/my/great/module.js'],
      },
    },
    files: ['node_modules/def/my/great/module.js'],
    packageName: 'def',
    size: 700,
  },
};

describe('getNodeModuleCollectionDiff', () => {
  it('should return undefined when there is no diff', () => {
    const result = getNodeModuleCollectionDiff(
      baseModuleCollection,
      baseModuleCollection,
    );
    expect(result).toEqual(undefined);
  });

  it('should return correct result when modules have been added', () => {
    const result = getNodeModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithAdded,
    );
    expect(result).toEqual({
      added: [
        {
          bundleDependents: {
            'chunks/klmn.js': {
              bundle: 'chunks/klmn.js',
              files: ['node_modules/zot/my/great/module.js'],
            },
          },
          files: ['node_modules/zot/my/great/module.js'],
          packageName: 'zot',
          size: 500,
        },
      ],
      removed: [],
      changed: [],
      totalBytes: 500,
    });
  });

  it('should return correct result when modules have been removed', () => {
    const result = getNodeModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithRemoved,
    );
    expect(result).toEqual({
      added: [],
      removed: [
        {
          bundleDependents: {
            'chunks/hij.js': {
              bundle: 'chunks/hij.js',
              files: ['node_modules/@foo/baz/my/great/module.js'],
            },
          },
          files: ['node_modules/@foo/baz/my/great/module.js'],
          packageName: '@foo/baz',
          size: 500,
        },
      ],
      changed: [],
      totalBytes: -500,
    });
  });

  it('should return correct result when modules have been changed', () => {
    const result = getNodeModuleCollectionDiff(baseModuleCollection, {
      ...moduleCollectionWithRemoved,
      '@foo/baz': {
        bundleDependents: {
          'chunks/hij.js': {
            bundle: 'chunks/hij.js',
            files: ['node_modules/@foo/baz/my/great/module.js'],
          },
        },
        files: ['node_modules/@foo/baz/my/great/module.js'],
        packageName: '@foo/baz',
        size: 600,
      },
    });
    expect(result).toEqual({
      added: [],
      removed: [],
      changed: [
        {
          bundleDependentCount: 0,
          fileCount: 0,
          packageName: '@foo/baz',
          size: 100,
        },
      ],
      totalBytes: 100,
    });
  });

  it('should return correct result when modules have been added, removed, and changed', () => {
    const result = getNodeModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithAddedAndChangedAndRemoved,
    );
    expect(result).toEqual({
      added: [
        {
          bundleDependents: {
            'chunks/klmn.js': {
              bundle: 'chunks/klmn.js',
              files: ['node_modules/abc/my/great/module.js'],
            },
          },
          files: ['node_modules/abc/my/great/module.js'],
          packageName: 'abc',
          size: 500,
        },
        {
          bundleDependents: {
            'chunks/ipsum.js': {
              bundle: 'chunks/ipsum.js',
              files: ['node_modules/def/my/great/module.js'],
            },
          },
          files: ['node_modules/def/my/great/module.js'],
          packageName: 'def',
          size: 700,
        },
      ],
      removed: [
        {
          bundleDependents: {
            'chunks/hij.js': {
              bundle: 'chunks/hij.js',
              files: ['node_modules/@foo/baz/my/great/module.js'],
            },
          },
          files: ['node_modules/@foo/baz/my/great/module.js'],
          packageName: '@foo/baz',
          size: 500,
        },
      ],
      changed: [
        {
          bundleDependentCount: 0,
          fileCount: 0,
          packageName: 'foo',
          size: -100,
        },
        {
          bundleDependentCount: 1,
          fileCount: 0,
          packageName: 'bar',
          size: 200,
        },
      ],
      totalBytes: 800,
    });
  });
});
