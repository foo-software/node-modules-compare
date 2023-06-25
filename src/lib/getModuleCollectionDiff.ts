import type {
  ModuleCollection,
  ModuleItemDiff,
  NodeModulesDiff,
} from '../types';

export const getModuleCollectionDiff = (
  moduleCollectionA: ModuleCollection,
  moduleCollectionB: ModuleCollection,
): NodeModulesDiff | undefined => {
  const added = [];
  const changed = [];
  const removed = [];
  let totalBytes = 0;

  let hasDiff = false;

  // check for added or changed
  for (const key in moduleCollectionB) {
    const moduleItemB = moduleCollectionB[key];
    if (!moduleCollectionA[key]) {
      // if added
      added.push(moduleItemB);
      totalBytes += moduleItemB.size;
      hasDiff = true;
    } else {
      // check if changed
      const moduleItemA = moduleCollectionA[key];
      let diff: ModuleItemDiff | undefined;
      const initialDiff = {
        bundleDependantCount: 0,
        file: key,
        size: 0,
      };
      if (
        moduleItemA.bundleDependants.length !==
        moduleItemB.bundleDependants.length
      ) {
        diff = {
          ...initialDiff,
          size:
            moduleItemB.bundleDependants.length -
            moduleItemA.bundleDependants.length,
        };
      }
      if (moduleItemA.size !== moduleItemB.size) {
        const sizeDiff = moduleItemB.size - moduleItemA.size;
        diff = {
          ...initialDiff,
          ...diff,
          size: sizeDiff,
        };
        totalBytes += sizeDiff;
      }
      if (diff) {
        changed.push(diff);
        hasDiff = true;
      }
    }
  }

  // check for removed
  for (const key in moduleCollectionA) {
    if (!moduleCollectionB[key]) {
      // if removed
      const moduleItem = moduleCollectionA[key];
      removed.push(moduleItem);
      totalBytes -= moduleItem.size;
      hasDiff = true;
    }
  }

  if (!hasDiff) {
    return;
  }

  return {
    added,
    changed,
    removed,
    totalBytes,
  };
};
