import fs from 'node:fs/promises';
import path from 'path';
import type { InputFileContent } from '../types';

export const getInputFileContent = async ({
  inputFile,
}: {
  inputFile: string;
}): Promise<InputFileContent> => {
  const currentWorkingDirectoryPath = process.cwd();

  const inputFilePath = path.resolve(currentWorkingDirectoryPath, inputFile);
  const inputFileContent = await fs.readFile(inputFilePath, 'utf8');
  return JSON.parse(inputFileContent);
};
