import type { InputResult, ModuleCollection } from '../types';

export const getModules = ({
  inputResults,
}: {
  inputResults: InputResult[];
}): ModuleCollection =>
  inputResults.reduce((accumulator: ModuleCollection, current) => {
    const updates: ModuleCollection = {};
    for (const key of Object.keys(current.files)) {
      if (
        key === '[sourceMappingURL]' ||
        key === '[unmapped]' ||
        key === '[EOLs]' ||
        key === '[no source]'
      ) {
        continue;
      }
      const moduleItem = current.files[key];
      if (updates[key] && updates[key].size === moduleItem.size) {
        updates[key].bundleDependants = [
          ...updates[key].bundleDependants,
          current.bundleName,
        ];
      } else if (
        accumulator[key] &&
        accumulator[key].size === moduleItem.size
      ) {
        updates[key] = {
          ...accumulator[key],
          bundleDependants: [
            ...accumulator[key].bundleDependants,
            current.bundleName,
          ],
        };
      } else {
        updates[key] = {
          bundleDependants: [current.bundleName],
          size: moduleItem.size,
        };
      }
    }
    return {
      ...accumulator,
      ...updates,
    };
  }, {});
