export interface Column<T> {
  id: string;
  accessor: (row: T) => any;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  sortFn?: (a: any, b: any) => number;
  filterFn?: (cellValue: any, filterValue: any) => boolean;
}
