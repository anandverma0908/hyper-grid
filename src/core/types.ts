import { Column } from "./columnModel";
import { Row } from "./rowModel";
import { GridState } from "./state";

export type GridPlugin<T> = (grid: GridInstance<T>) => void;
export type RowTransformer<T> = (rows: Row<T>[]) => Row<T>[];

export interface GridFeatures {
  sorting?: boolean;
  filtering?: boolean;
  pagination?: {
    pageSize?: number;
  };
  pinning?: boolean;
  columnReorder?: boolean;
  rowDrag?: boolean;
}

export interface GridOptions<T> {
  data: T[];
  columns: Column<T>[];
  initialState?: Partial<GridState>;
  state?: Partial<GridState>;
  onStateChange?: (state: GridState) => void;
  features?: GridFeatures;
  plugins?: GridPlugin<T>[];
}

export interface GridInstance<T> {
  options: GridOptions<T>;
  state: GridState;
  setState: (updater: (prev: GridState) => GridState) => void;
  pipeline: RowTransformer<T>[];
  getCoreRowModel: () => Row<T>[];
  getRowModel: () => Row<T>[];
  setSorting?: (sorting: any) => void;
  setFilter?: (columnId: string, value: any) => void;
  setPageIndex?: (index: number) => void;
}
