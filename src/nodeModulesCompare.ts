import fs from 'node:fs/promises';
import path from 'path';
import { createJsonFile } from './lib/createJsonFile';


export interface ModuleItem {
  bundleDependants: string[];
  size: number;
}

export type ModuleCollection = Record<string, ModuleItem>;

interface InputResult {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export const nodeModulesCompare = async ({
  inputFile,
  inputFileWithChanges,
  outputDirectory = './',
}: {
  inputFile: string;
  inputFileWithChanges?: string;
  outputDirectory?: string;
}): Promise<ModuleCollection> => {
  const currentWorkingDirectoryPath = process.cwd();

  const inputFilePath = path.resolve(currentWorkingDirectoryPath, inputFile);
  const inputFileContent = await fs.readFile(inputFilePath, 'utf8');
  const inputFileJsonContent: {
    results: InputResult[];
  } = JSON.parse(inputFileContent);

  const outputDirectoryPath = path.resolve(
    currentWorkingDirectoryPath,
    outputDirectory,
  );

  const modules = inputFileJsonContent.results.reduce(
    (accumulator: ModuleCollection, current) => {
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
    },
    {},
  );

  createJsonFile({
    content: {
      modules,
    },
    outputPath: `${outputDirectoryPath}/comparison-${Date.now()}.json`,
  });

  return modules;
};