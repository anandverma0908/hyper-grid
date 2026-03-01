import React from "react";
import { useGrid } from "../hooks/useGrid";

export function GridTable<T>(props: any) {
  const grid = useGrid(props);

  const rows = grid.getRowModel();

  return (
    <table border={1}>
      <thead>
        <tr>
          {grid.options.columns.map((col) => (
            <th
              key={col.id}
              onClick={() => {
                if (col.sortable && grid.setSorting) {
                  grid.setSorting([{ id: col.id, desc: false }]);
                }
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {grid.options.columns.map((col) => (
              <td key={col.id}>{col.accessor(row.original)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
