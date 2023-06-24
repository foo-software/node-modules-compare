import type {
  InputResult,
  ModuleCollection,
  ModuleCollectionWithIds,
} from '../types';

export const getModules = ({
  inputResults,
}: {
  inputResults: InputResult[];
}): ModuleCollection => {
  const result = inputResults.reduce(
    (accumulator: ModuleCollectionWithIds, current) => {
      const updates: ModuleCollectionWithIds = {};
      for (const key of Object.keys(current.files)) {
        if (
          key === '[sourceMappingURL]' ||
          key === '[unmapped]' ||
          key === '[EOLs]' ||
          key === '[no source]' ||
          !key.includes('node_modules')
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
            _id: key,
            bundleDependants: [current.bundleName],
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
    const { _id, ...rest } = current;
    return {
      ...accumulator,
      [_id]: rest,
    };
  }, {});
};
