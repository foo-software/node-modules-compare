import type {
  NodeModuleCollection,
  NodeModuleItemDiff,
  NodeModulesDiff,
} from '../types';

export const getNodeModuleCollectionDiff = (
  moduleCollectionA: NodeModuleCollection,
  moduleCollectionB: NodeModuleCollection,
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
      let diff: NodeModuleItemDiff | undefined;
      const initialDiff = {
        bundleDependentCount: 0,
        fileCount: 0,
        packageName: moduleItemB.packageName,
        size: 0,
      };
      const moduleItemABundleDependentsCount = Object.keys(
        moduleItemA.bundleDependents,
      ).length;
      const moduleItemBBundleDependentsCount = Object.keys(
        moduleItemB.bundleDependents,
      ).length;
      if (
        moduleItemABundleDependentsCount !== moduleItemBBundleDependentsCount
      ) {
        diff = {
          ...initialDiff,
          bundleDependentCount:
            moduleItemBBundleDependentsCount - moduleItemABundleDependentsCount,
        };
      }
      if (moduleItemA.files.length !== moduleItemB.files.length) {
        diff = {
          ...initialDiff,
          fileCount: moduleItemB.files.length - moduleItemA.files.length,
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
