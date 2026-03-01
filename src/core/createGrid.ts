import { filteringPlugin } from "../plugins/filtering";
import { paginationPlugin } from "../plugins/pagination";
import { sortingPlugin } from "../plugins/sorting";
import { GridState } from "./state";
import { GridInstance, GridOptions, GridPlugin } from "./types";

export function createGrid<T>(options: GridOptions<T>): GridInstance<T> {
  let internalState: GridState = {
    pageIndex: 0,
    pageSize: options.features?.pagination?.pageSize ?? 10,
    ...options.initialState,
  };

  if (options.state) {
    internalState = {
      ...internalState,
      ...options.state,
    };
  }

  const instance: GridInstance<T> = {
    options,
    state: internalState,
    pipeline: [],

    setState(updater) {
      const next = updater(instance.state);

      if (options.onStateChange) {
        options.onStateChange(next);
      } else {
        instance.state = next;
      }
    },

    getCoreRowModel() {
      return options.data.map((row, index) => ({
        id: String(index),
        original: row,
        depth: 0,
      }));
    },

    getRowModel() {
      let rows = instance.getCoreRowModel();

      for (const transform of instance.pipeline) {
        rows = transform(rows);
      }

      return rows;
    },
  };

  const plugins: GridPlugin<T>[] = [];

  if (options.features?.sorting) {
    plugins.push(sortingPlugin());
  }

  if (options.features?.filtering) {
    plugins.push(filteringPlugin());
  }

  if (options.features?.pagination) {
    plugins.push(paginationPlugin(options.features.pagination));
  }

  if (options.plugins) {
    plugins.push(...options.plugins);
  }

  plugins.forEach((plugin) => plugin(instance));

  return instance;
}
