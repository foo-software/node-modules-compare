export interface InputResult {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export interface ModuleItem {
  bundleDependants: string[];
  size: number;
}

export type ModuleCollection = Record<string, ModuleItem>;
