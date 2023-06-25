export interface InputResult {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export interface InputFileContent {
  results: InputResult[];
}

export interface ModuleItem {
  bundleDependants: string[];
  file: string;
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
  diff?: NodeModulesDiff;
  modules: ModuleCollection;
  modulesWithChanges?: ModuleCollection;
}
