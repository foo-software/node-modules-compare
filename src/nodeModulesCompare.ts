import path from 'path';
import { createJsonFile } from './lib/createJsonFile';
import { getInputFileContent } from './lib/getInputFileContent';
import { getModules } from './lib/getModules';
import { getNodeModuleCollectionDiff } from './lib/getNodeModuleCollectionDiff';
import { getNodeModules } from './lib/getNodeModules';
import type { NodeModuleCollection, NodeModulesCompareResult } from './types';

export const nodeModulesCompare = async ({
  inputFile,
  inputFileWithChanges,
  outputDirectory,
  shouldOmitNodeModuleData,
}: {
  /** The input file path relative to current working directory */
  inputFile: string;

  /** The input file with changes path relative to current working directory */
  inputFileWithChanges?: string;

  /** The output directory path relative to current working directory */
  outputDirectory?: string;

  /** If `true` node module data will be ommitted from the resulting dataset */
  shouldOmitNodeModuleData?: boolean;
}): Promise<NodeModulesCompareResult> => {
  const currentWorkingDirectoryPath = process.cwd();

  const inputFileJsonContent = await getInputFileContent({
    inputFile,
  });

  const modules = getModules({
    inputResults: inputFileJsonContent.results,
    onlyNodeModules: true,
  });
  const nodeModules = getNodeModules({
    modules,
  });

  let nodeModulesWithChanges: NodeModuleCollection | undefined;
  if (inputFileWithChanges) {
    const inputFileJsonContentWithChanges = await getInputFileContent({
      inputFile: inputFileWithChanges,
    });
    const modulesWithChanges = getModules({
      inputResults: inputFileJsonContentWithChanges.results,
      onlyNodeModules: true,
    });
    nodeModulesWithChanges = getNodeModules({
      modules: modulesWithChanges,
    });
  }

  const result: NodeModulesCompareResult = {
    diff: !nodeModulesWithChanges
      ? undefined
      : getNodeModuleCollectionDiff(nodeModules, nodeModulesWithChanges),
  };

  if (!shouldOmitNodeModuleData) {
    result.nodeModules = nodeModules;
    result.nodeModulesWithChanges = nodeModulesWithChanges;
  }

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
