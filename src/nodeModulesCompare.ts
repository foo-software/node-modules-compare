import fs from 'node:fs/promises';
import path from 'path';
import { createJsonFile } from './lib/createJsonFile';
import { getModules } from './lib/getModules';
import type { InputResult, ModuleCollection } from './types';

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

  const modules = getModules({ inputResults: inputFileJsonContent.results });

  let modulesWithChanges: ModuleCollection | undefined;

  if (inputFileWithChanges) {
    const inputFilePathWithChanges = path.resolve(
      currentWorkingDirectoryPath,
      inputFileWithChanges,
    );
    const inputFileContentWithChanges = await fs.readFile(
      inputFilePathWithChanges,
      'utf8',
    );
    const inputFileJsonContentWithChanges: {
      results: InputResult[];
    } = JSON.parse(inputFileContentWithChanges);
    modulesWithChanges = getModules({
      inputResults: inputFileJsonContentWithChanges.results,
    });
  }

  const result = {
    modules,
    modulesWithChanges,
  };

  createJsonFile({
    content: result,
    outputPath: `${outputDirectoryPath}/comparison-${Date.now()}.json`,
  });

  return modules;
};
