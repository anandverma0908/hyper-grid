import { useMemo } from "react";

interface VirtualRowsOptions {
  rowCount: number;
  rowHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function useVirtualRows({
  rowCount,
  rowHeight,
  viewportHeight,
  scrollTop,
  overscan = 5,
}: VirtualRowsOptions) {
  return useMemo(() => {
    const totalHeight = rowCount * rowHeight;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / rowHeight) - overscan,
    );

    const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;

    const endIndex = Math.min(rowCount, startIndex + visibleCount);

    const offsetY = startIndex * rowHeight;

    return {
      totalHeight,
      startIndex,
      endIndex,
      offsetY,
    };
  }, [rowCount, rowHeight, viewportHeight, scrollTop, overscan]);
}
