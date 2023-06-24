export interface InputResult {
  bundleName: string;
  files: Record<string, { size: number }>;
}

export interface ModuleItem {
  bundleDependants: string[];
  size: number;
}

export interface ModuleItemWithId extends ModuleItem {
  _id: string;
}

export type ModuleCollection = Record<string, ModuleItem>;

export type ModuleCollectionWithIds = Record<string, ModuleItemWithId>;
