export type SortingState = { id: string; desc: boolean }[];
export type FilterState = Record<string, any>;

export interface GridState {
  sorting?: SortingState;
  filters?: FilterState;
  pageIndex?: number;
  pageSize?: number;
  pinnedColumns?: string[];
  columnOrder?: string[];
}
