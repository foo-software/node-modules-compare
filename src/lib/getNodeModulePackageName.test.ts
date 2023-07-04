import {
  ERROR_MESSAGE_MALFORMED_FILE_PATH,
  getNodeModulePackageName,
} from './getNodeModulePackageName';

describe('getNodeModulePackageName ', () => {
  it('should return package name', () => {
    const result = getNodeModulePackageName(
      'some/path/to/node_modules/my-node-module/foo/bar.js',
    );
    expect(result).toBe('my-node-module');
  });

  it('should return package name of scoped package', () => {
    const result = getNodeModulePackageName(
      'some/path/to/node_modules/@my-scoped-node-module/foo/bar.js',
    );
    expect(result).toBe('@my-scoped-node-module/foo');
  });

  it('should throw an error when the file path is malformed', () => {
    expect(() => {
      getNodeModulePackageName('malformed/file/path');
    }).toThrow(ERROR_MESSAGE_MALFORMED_FILE_PATH);
  });
});
