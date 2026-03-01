export interface Row<T> {
  id: string;
  original: T;
  depth: number;
  parent?: Row<T>;
  subRows?: Row<T>[];
}