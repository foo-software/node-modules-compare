export const ERROR_MESSAGE_MALFORMED_FILE_PATH =
  'Node module has a malformed file path';

export const getNodeModulePackageName = (file: string) => {
  const [, modulePath] = file.split('node_modules/');
  if (!modulePath) {
    throw new Error('Node module has a malformed file path');
  }
  const modulePathParts = modulePath.split('/');
  const isScoped = modulePath[0] === '@';
  if (!isScoped) {
    return modulePathParts[0];
  }
  return `${modulePathParts[0]}/${modulePathParts[1]}`;
};
