import type { InputResult, ModuleCollection } from '../types';

export const getModules = ({
  inputResults,
  onlyNodeModules,
}: {
  inputResults: InputResult[];
  onlyNodeModules?: boolean;
}): ModuleCollection => {
  const result = inputResults.reduce(
    (accumulator: ModuleCollection, current) => {
      const updates: ModuleCollection = {};
      for (const key of Object.keys(current.files)) {
        if (
          key === '[sourceMappingURL]' ||
          key === '[unmapped]' ||
          key === '[EOLs]' ||
          key === '[no source]' ||
          (!!onlyNodeModules && !key.includes('node_modules'))
        ) {
          continue;
        }
        const moduleItem = current.files[key];
        if (updates[key] && updates[key].size === moduleItem.size) {
          updates[key].bundleDependents = [
            ...updates[key].bundleDependents,
            current.bundleName,
          ];
        } else if (
          accumulator[key] &&
          accumulator[key].size === moduleItem.size
        ) {
          updates[key] = {
            ...accumulator[key],
            bundleDependents: [
              ...accumulator[key].bundleDependents,
              current.bundleName,
            ],
          };
        } else {
          updates[key] = {
            bundleDependents: [current.bundleName],
            file: key,
            size: moduleItem.size,
          };
        }
      }
      return {
        ...accumulator,
        ...updates,
      };
    },
    {},
  );

  // sort to show largest in size first
  const values = Object.values(result);
  values.sort((a, b) => (a.size < b.size ? 1 : -1));

  return values.reduce((accumulator: ModuleCollection, current) => {
    return {
      ...accumulator,
      [current.file]: current,
    };
  }, {});
};
