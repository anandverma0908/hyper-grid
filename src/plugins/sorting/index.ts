import { GridPlugin } from "../../core/types";

export function sortingPlugin<T>(): GridPlugin<T> {
  return (grid) => {
    grid.state.sorting = [];

    grid.pipeline.push((rows) => {
      const sorting = grid.state.sorting;
      if (!sorting?.length) return rows;

      const { id, desc } = sorting[0];

      const column = grid.options.columns.find(
        (c) => c.id === id && c.sortable,
      );
      if (!column) return rows;

      return [...rows].sort((a, b) => {
        const aValue = column.accessor(a.original);
        const bValue = column.accessor(b.original);

        if (column.sortFn) {
          return desc
            ? -column.sortFn(aValue, bValue)
            : column.sortFn(aValue, bValue);
        }

        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
      });
    });

    grid.setSorting = (sorting) => {
      grid.setState((prev) => ({
        ...prev,
        sorting,
      }));
    };
  };
}
