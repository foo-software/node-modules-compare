export interface NodeModulesCompareInputPayload {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export interface InputFileContent {
  results: NodeModulesCompareInputPayload[];
}

export interface ModuleItem {
  /** Bundles that depend on the module being analyzed */
  bundleDependents: string[];

  /** The file path or id of the module */
  file: string;

  /** The size in bytes of the module */
  size: number;
}

export type ModuleCollection = Record<string, ModuleItem>;

export interface NodeModuleBundleDependent {
  /** Bundle file or id that depends on the Node module being analyzed */
  bundle: string;

  /** The file paths or ids being used from the Node module being analyzed */
  files: string[];
}

export type NodeModuleBundleDependentCollection = Record<
  string,
  NodeModuleBundleDependent
>;

export interface NodeModuleItem {
  /** Bundles that depend on the Node module being analyzed */
  bundleDependents: NodeModuleBundleDependentCollection;

  /** The file paths or ids being used from the Node module being analyzed */
  files: string[];

  /** The package name of the Node module being analyzed */
  packageName: string;

  /** The total size in bytes of all files being used from the Node module being analyzed */
  size: number;
}

export type NodeModuleCollection = Record<string, NodeModuleItem>;

export interface NodeModuleItemDiff {
  /** The bundle dependents count difference between original and changed */
  bundleDependentCount: number;

  /** The number of files used from the module difference between original and changed */
  fileCount: number;

  /** The package name of the Node module being analyzed */
  packageName: string;

  /** The size in bytes difference between original and changed */
  size: number;
}

export interface NodeModulesDiff {
  /** An array of data representing modules that were added */
  added: NodeModuleItem[];

  /** An array of data representing modules that changed */
  changed: NodeModuleItemDiff[];

  /** An array of data representing modules that were removed */
  removed: NodeModuleItem[];

  /** The total bytes difference between original and changed */
  totalBytes: number;
}

export interface NodeModulesCompareResult {
  /** The difference between original and changed modules */
  diff?: NodeModulesDiff;

  /** A collection dataset of Node modules and corresponding data */
  nodeModules?: NodeModuleCollection;

  /** A collection dataset of newer modules that may have changed and corresponding data */
  nodeModulesWithChanges?: NodeModuleCollection;

  /** File path the result is written to */
  resultFilePath?: string;
}
