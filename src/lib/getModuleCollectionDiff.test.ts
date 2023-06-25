import { ModuleCollection } from '../types';
import { getModuleCollectionDiff } from './getModuleCollectionDiff';

const moduleCollectionWithRemoved: ModuleCollection = {
  'node_modules/my/great/module.js': {
    bundleDependants: ['chunks/abc.js'],
    file: 'node_modules/my/great/module.js',
    size: 200,
  },
  'node_modules/my/great/module2.js': {
    bundleDependants: ['chunks/efg.js'],
    file: 'node_modules/my/great/module2.js',
    size: 300,
  },
};

const baseModuleCollection: ModuleCollection = {
  ...moduleCollectionWithRemoved,
  'node_modules/my/great/module3.js': {
    bundleDependants: ['chunks/hij.js'],
    file: 'node_modules/my/great/module3.js',
    size: 500,
  },
};

const moduleCollectionWithAdded: ModuleCollection = {
  ...baseModuleCollection,
  'node_modules/my/great/module4.js': {
    bundleDependants: ['chunks/klmn.js'],
    file: 'node_modules/my/great/module4.js',
    size: 500,
  },
};

const moduleCollectionWithAddedAndChangedAndRemoved: ModuleCollection = {
  // changed `size` - 100
  'node_modules/my/great/module.js': {
    bundleDependants: ['chunks/abc.js'],
    file: 'node_modules/my/great/module.js',
    size: 100,
  },
  // changed `size` + 200, `bundleDependants` + 1
  'node_modules/my/great/module2.js': {
    bundleDependants: ['chunks/efg.js', 'chunks/hij.js'],
    file: 'node_modules/my/great/module2.js',
    size: 500,
  },
  // removed is `module3.js`
  // added
  'node_modules/my/great/module4.js': {
    bundleDependants: ['chunks/klmn.js'],
    file: 'node_modules/my/great/module4.js',
    size: 500,
  },
  'node_modules/my/great/module5.js': {
    bundleDependants: ['chunks/ipsum.js'],
    file: 'node_modules/my/great/module5.js',
    size: 700,
  },
};

describe('getModuleCollectionDiff', () => {
  it('should return undefined when there is no diff', () => {
    const result = getModuleCollectionDiff(
      baseModuleCollection,
      baseModuleCollection,
    );
    expect(result).toEqual(undefined);
  });

  it('should return correct result when modules have been added', () => {
    const result = getModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithAdded,
    );
    expect(result).toEqual({
      added: [
        {
          bundleDependants: ['chunks/klmn.js'],
          file: 'node_modules/my/great/module4.js',
          size: 500,
        },
      ],
      removed: [],
      changed: [],
      totalBytes: 500,
    });
  });

  it('should return correct result when modules have been removed', () => {
    const result = getModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithRemoved,
    );
    expect(result).toEqual({
      added: [],
      removed: [
        {
          bundleDependants: ['chunks/hij.js'],
          file: 'node_modules/my/great/module3.js',
          size: 500,
        },
      ],
      changed: [],
      totalBytes: -500,
    });
  });

  it('should return correct result when modules have been changed', () => {
    const result = getModuleCollectionDiff(baseModuleCollection, {
      ...moduleCollectionWithRemoved,
      'node_modules/my/great/module3.js': {
        bundleDependants: ['chunks/hij.js'],
        file: 'node_modules/my/great/module3.js',
        size: 600,
      },
    });
    expect(result).toEqual({
      added: [],
      removed: [],
      changed: [
        {
          bundleDependantCount: 0,
          file: 'node_modules/my/great/module3.js',
          size: 100,
        },
      ],
      totalBytes: 100,
    });
  });

  it('should return correct result when modules have been added, removed, and changed', () => {
    const result = getModuleCollectionDiff(
      baseModuleCollection,
      moduleCollectionWithAddedAndChangedAndRemoved,
    );
    expect(result).toEqual({
      added: [
        {
          bundleDependants: ['chunks/klmn.js'],
          file: 'node_modules/my/great/module4.js',
          size: 500,
        },
        {
          bundleDependants: ['chunks/ipsum.js'],
          file: 'node_modules/my/great/module5.js',
          size: 700,
        },
      ],
      removed: [
        {
          bundleDependants: ['chunks/hij.js'],
          file: 'node_modules/my/great/module3.js',
          size: 500,
        },
      ],
      changed: [
        {
          bundleDependantCount: 0,
          file: 'node_modules/my/great/module.js',
          size: -100,
        },
        {
          bundleDependantCount: 1,
          file: 'node_modules/my/great/module2.js',
          size: 200,
        },
      ],
      totalBytes: 800,
    });
  });
});
