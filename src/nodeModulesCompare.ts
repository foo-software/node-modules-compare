import path from 'path';
import { createJsonFile } from './lib/createJsonFile';
import { getInputFileContent } from './lib/getInputFileContent';
import { getModuleCollectionDiff } from './lib/getModuleCollectionDiff';
import { getModules } from './lib/getModules';
import type { ModuleCollection, NodeModulesCompareResult } from './types';

export const nodeModulesCompare = async ({
  inputFile,
  inputFileWithChanges,
  onlyNodeModules = true,
  outputDirectory,
}: {
  inputFile: string;
  inputFileWithChanges?: string;
  onlyNodeModules?: boolean;
  outputDirectory?: string;
}): Promise<NodeModulesCompareResult> => {
  const currentWorkingDirectoryPath = process.cwd();

  const inputFileJsonContent = await getInputFileContent({
    inputFile,
  });

  const modules = getModules({
    inputResults: inputFileJsonContent.results,
    onlyNodeModules,
  });

  let modulesWithChanges: ModuleCollection | undefined;

  if (inputFileWithChanges) {
    const inputFileJsonContentWithChanges = await getInputFileContent({
      inputFile: inputFileWithChanges,
    });
    modulesWithChanges = getModules({
      inputResults: inputFileJsonContentWithChanges.results,
      onlyNodeModules,
    });
  }

  const result = {
    diff: !modulesWithChanges
      ? undefined
      : getModuleCollectionDiff(modules, modulesWithChanges),
    modules,
    modulesWithChanges,
  };

  let resultFilePath: string | undefined;
  if (outputDirectory) {
    const outputDirectoryPath = path.resolve(
      currentWorkingDirectoryPath,
      outputDirectory,
    );

    resultFilePath = `${outputDirectoryPath}/comparison-${Date.now()}.json`;

    createJsonFile({
      content: result,
      outputPath: resultFilePath,
    });
  }

  return {
    ...result,
    resultFilePath,
  };
};
