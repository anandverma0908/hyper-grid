import { useMemo } from "react";

interface VirtualColumnsOptions {
  columnWidths: number[];
  viewportWidth: number;
  scrollLeft: number;
  overscan?: number;
}

export function useVirtualColumns({
  columnWidths,
  viewportWidth,
  scrollLeft,
  overscan = 2,
}: VirtualColumnsOptions) {
  const prefixWidths = useMemo(() => {
    const arr = [];
    let sum = 0;
    for (let w of columnWidths) {
      arr.push(sum);
      sum += w;
    }
    return arr;
  }, [columnWidths]);

  return useMemo(() => {
    let accumulatedWidth = 0;
    let startIndex = 0;

    for (let i = 0; i < columnWidths.length; i++) {
      if (accumulatedWidth + columnWidths[i] > scrollLeft) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      accumulatedWidth += columnWidths[i];
    }

    let visibleWidth = 0;
    let endIndex = startIndex;

    while (endIndex < columnWidths.length && visibleWidth < viewportWidth) {
      visibleWidth += columnWidths[endIndex];
      endIndex++;
    }

    endIndex = Math.min(columnWidths.length, endIndex + overscan);

    const offsetX = prefixWidths[startIndex] || 0;

    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

    return {
      totalWidth,
      startIndex,
      endIndex,
      offsetX,
    };
  }, [columnWidths, viewportWidth, scrollLeft, overscan]);
}
