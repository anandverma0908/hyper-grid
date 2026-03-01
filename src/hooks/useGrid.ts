import { useMemo, useState } from "react";
import { createGrid } from "../core/createGrid";
import { GridOptions } from "../core/types";

export function useGrid<T>(options: GridOptions<T>) {
  const [state, setState] = useState(options.initialState || {});

  const grid = useMemo(() => {
    return createGrid({
      ...options,
      state,
      onStateChange: setState,
    });
  }, [options.data, options.columns, state]);

  return grid;
}
