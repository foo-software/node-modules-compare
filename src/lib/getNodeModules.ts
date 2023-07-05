import type {
  NodeModuleBundleDependentCollection,
  NodeModuleCollection,
  ModuleCollection,
} from '../types';
import { getNodeModulePackageName } from './getNodeModulePackageName.js';

const getBundleDependents = ({
  bundles,
  existingBundleDependents,
  file,
}: {
  bundles: string[];
  existingBundleDependents?: NodeModuleBundleDependentCollection;
  file: string;
}): NodeModuleBundleDependentCollection =>
  bundles.reduce(
    (accumulator: NodeModuleBundleDependentCollection, current) => ({
      ...accumulator,
      [current]: {
        bundle: current,
        files: [
          ...(!accumulator[current]?.files?.length
            ? []
            : accumulator[current].files),
          ...(accumulator[current]?.files?.length &&
          accumulator[current].files.includes(file)
            ? []
            : [file]),
        ],
      },
    }),
    existingBundleDependents || {},
  );

export const getNodeModules = ({
  modules,
}: {
  modules: ModuleCollection;
}): NodeModuleCollection => {
  const nodeModuleCollection: NodeModuleCollection = {};
  for (const moduleItemKey in modules) {
    const moduleItem = modules[moduleItemKey];
    const packageName = getNodeModulePackageName(moduleItem.file);
    if (!nodeModuleCollection[packageName]) {
      nodeModuleCollection[packageName] = {
        bundleDependents: getBundleDependents({
          bundles: moduleItem.bundleDependents,
          file: moduleItem.file,
        }),
        files: [moduleItem.file],
        packageName,
        size: moduleItem.size,
      };
    } else {
      nodeModuleCollection[packageName] = {
        bundleDependents: getBundleDependents({
          bundles: moduleItem.bundleDependents,
          existingBundleDependents:
            nodeModuleCollection[packageName].bundleDependents,
          file: moduleItem.file,
        }),
        files: [...nodeModuleCollection[packageName].files, moduleItem.file],
        packageName,
        size: nodeModuleCollection[packageName].size + moduleItem.size,
      };
    }
  }
  return nodeModuleCollection;
};
