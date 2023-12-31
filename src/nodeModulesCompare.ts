import path from 'path';
import { createJsonFile } from './lib/createJsonFile.js';
import { getInputFileContent } from './lib/getInputFileContent.js';
import { getModules } from './lib/getModules.js';
import { getNodeModuleCollectionDiff } from './lib/getNodeModuleCollectionDiff.js';
import { getNodeModules } from './lib/getNodeModules.js';
import type {
  NodeModulesCompareInputPayload,
  NodeModuleCollection,
  NodeModulesCompareResult,
} from './types';

export const nodeModulesCompare = async ({
  input,
  inputFile,
  inputFileWithChanges,
  inputWithChanges,
  outputDirectory,
  shouldOmitNodeModuleData,
}: {
  /** The input payload (if not using `inputFile`) */
  input?: NodeModulesCompareInputPayload[];

  /** The input file path relative to current working directory (if not using `input` param) */
  inputFile?: string;

  /** The input file with changes path relative to current working directory (if not using `inputWithChanges` param) */
  inputFileWithChanges?: string;

  /** The input with changes payload (if not using `inputFileWithChanges`) */
  inputWithChanges?: NodeModulesCompareInputPayload[];

  /** The output directory path relative to current working directory. If `undefined`, file will not be output */
  outputDirectory?: string;

  /** If `true` node module data will be ommitted from the resulting dataset */
  shouldOmitNodeModuleData?: boolean;
}): Promise<NodeModulesCompareResult> => {
  // validate input
  if (!input && !inputFile) {
    throw new Error('Either `input` or `inputFile` must be provided');
  }

  const currentWorkingDirectoryPath = process.cwd();

  let inputResults: NodeModulesCompareInputPayload[] | undefined = input;
  if (!inputResults && inputFile) {
    const inputFileJsonContent = await getInputFileContent({
      inputFile,
    });
    inputResults = inputFileJsonContent.results;
  }

  if (!inputResults) {
    throw new Error(
      `There was a problem finding the input. Check that the input or input file is formatted correctly`,
    );
  }

  const modules = getModules({
    inputResults,
    onlyNodeModules: true,
  });
  const nodeModules = getNodeModules({
    modules,
  });

  let nodeModulesWithChanges: NodeModuleCollection | undefined;
  if (inputWithChanges || inputFileWithChanges) {
    let inputResultsWithChanges: NodeModulesCompareInputPayload[] | undefined =
      inputWithChanges;
    if (!inputResultsWithChanges && inputFileWithChanges) {
      const inputFileJsonContentWithChanges = await getInputFileContent({
        inputFile: inputFileWithChanges,
      });
      inputResultsWithChanges = inputFileJsonContentWithChanges.results;
    }
    if (inputResultsWithChanges) {
      const modulesWithChanges = getModules({
        inputResults: inputResultsWithChanges,
        onlyNodeModules: true,
      });
      nodeModulesWithChanges = getNodeModules({
        modules: modulesWithChanges,
      });
    }
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
