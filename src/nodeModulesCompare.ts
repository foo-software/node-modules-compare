import path from 'path';
import { createJsonFile } from './lib/createJsonFile';
import { getInputFileContent } from './lib/getInputFileContent';
import { getModules } from './lib/getModules';
import { getNodeModuleCollectionDiff } from './lib/getNodeModuleCollectionDiff';
import { getNodeModules } from './lib/getNodeModules';
import type {
  InputPayload,
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
  input?: InputPayload[];

  /** The input file path relative to current working directory (if not using `input` param) */
  inputFile: string;

  /** The input file with changes path relative to current working directory (if not using `inputWithChanges` param) */
  inputFileWithChanges?: string;

  /** The input with changes payload (if not using `inputFileWithChanges`) */
  inputWithChanges?: InputPayload[];

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

  let inputResults: InputPayload[] | undefined = input;
  if (!inputResults) {
    const inputFileJsonContent = await getInputFileContent({
      inputFile,
    });
    inputResults = inputFileJsonContent.results;
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
    let inputResultsWithChanges: InputPayload[] | undefined = inputWithChanges;
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
