export interface InputResult {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export interface InputFileContent {
  results: InputResult[];
}

export interface ModuleItem {
  /** Bundles that depend on the module being analyzed */
  bundleDependants: string[];

  /** The file path or id of the module */
  file: string;

  /** The size in bytes of the module */
  size: number;
}

export type ModuleCollection = Record<string, ModuleItem>;

export interface ModuleItemDiff {
  /** The bundle dependants count difference between original and changed */
  bundleDependantCount: number;

  /** The file path or identifier of the module */
  file: string;

  /** The size in bytes difference between original and changed */
  size: number;
}

export interface NodeModulesDiff {
  /** An array of data representing modules that were added */
  added: ModuleItem[];

  /** An array of data representing modules that changed */
  changed: ModuleItemDiff[];

  /** An array of data representing modules that were removed */
  removed: ModuleItem[];

  /** The total bytes difference between original and changed */
  totalBytes: number;
}

export interface NodeModulesCompareResult {
  /** The difference between original and changed modules */
  diff?: NodeModulesDiff;

  /** A collection dataset of modules and corresponding data */
  modules: ModuleCollection;

  /** A collection dataset of newer modules that may have changed and corresponding data */
  modulesWithChanges?: ModuleCollection;

  /** File path the result is written to */
  resultFilePath?: string;
}
