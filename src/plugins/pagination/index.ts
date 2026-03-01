import { GridPlugin } from "../../core/types";

export function paginationPlugin<T>(config?: {
  pageSize?: number;
}): GridPlugin<T> {
  return (grid) => {
    grid.state.pageIndex = 0;
    grid.state.pageSize = config?.pageSize ?? grid.state.pageSize ?? 10;

    grid.pipeline.push((rows) => {
      const { pageIndex = 0, pageSize = 10 } = grid.state;

      const start = pageIndex * pageSize;
      const end = start + pageSize;

      return rows.slice(start, end);
    });

    grid.setPageIndex = (index) => {
      grid.setState((prev) => ({
        ...prev,
        pageIndex: index,
      }));
    };
  };
}
