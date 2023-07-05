import fs from 'fs';
import { createDirectory } from './createDirectory.js';

export const createJsonFile = ({
  content,
  outputPath,
}: {
  content: any;
  outputPath: string;
}) => {
  const filename = outputPath.substring(outputPath.lastIndexOf('/') + 1);
  createDirectory(outputPath.replace(`/${filename}`, ''));
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
};
