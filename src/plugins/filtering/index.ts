import { GridPlugin } from "../../core/types";

export function filteringPlugin<T>(): GridPlugin<T> {
  return (grid) => {
    grid.state.filters = {};

    grid.pipeline.push((rows) => {
      const filters = grid.state.filters;
      if (!filters) return rows;

      return rows.filter((row) => {
        return Object.entries(filters).every(([columnId, value]) => {
          const column = grid.options.columns.find(
            (c) => c.id === columnId && c.filterable,
          );
          if (!column) return true;

          const cellValue = column.accessor(row.original);

          if (column.filterFn) {
            return column.filterFn(cellValue, value);
          }

          return String(cellValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      });
    });

    grid.setFilter = (columnId, value) => {
      grid.setState((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          [columnId]: value,
        },
      }));
    };
  };
}
