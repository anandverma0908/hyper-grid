import React, { useEffect, useRef, useState } from "react";
import { useGrid } from "../hooks/useGrid";
import { useVirtualRows } from "../virtualisation/useVirtualRows";
import { useVirtualColumns } from "../virtualisation/useVirtualColumns";

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;

export function GridTable<T>(props: any) {
  const grid = useGrid<T>(props);
  const rows = grid.getRowModel();
  const columns = grid.options.columns;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTopRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [, forceUpdate] = useState({});

  const height = 500;
  const width = 900;

  const columnWidths = columns.map((c: any) => c.width || 150);

  const {
    totalHeight,
    startIndex: rowStart,
    endIndex: rowEnd,
    offsetY,
  } = useVirtualRows({
    rowCount: rows.length,
    rowHeight: ROW_HEIGHT,
    viewportHeight: height - HEADER_HEIGHT,
    scrollTop: scrollTopRef.current,
    overscan: 8,
  });

  const tickingRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(width);

  useEffect(() => {
    if (scrollRef.current) {
      setViewportWidth(scrollRef.current.clientWidth);
    }
  }, []);

  const {
    totalWidth,
    startIndex: colStart,
    endIndex: colEnd,
    offsetX,
  } = useVirtualColumns({
    columnWidths,
    viewportWidth,
    scrollLeft: scrollLeftRef.current,
    overscan: 2,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    if (!tickingRef.current) {
      tickingRef.current = true;

      requestAnimationFrame(() => {
        scrollTopRef.current = target.scrollTop;
        scrollLeftRef.current = target.scrollLeft;
        forceUpdate({});
        tickingRef.current = false;
      });
    }
  };

  console.log({
    cc: columns.slice(colStart, colEnd),
    rr: rows.slice(rowStart, rowEnd),
  });

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        height,
        width,
        overflow: "auto",
        position: "relative",
        border: "1px solid #ccc",
        fontFamily: "sans-serif",
        fontSize: 14,
      }}
    >
      {/* Total scrollable area */}
      <div
        style={{
          width: totalWidth,
          height: totalHeight + HEADER_HEIGHT,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: HEADER_HEIGHT,
            background: "#fafafa",
            borderBottom: "1px solid #ddd",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              display: "flex",
              transform: `translate3d(${offsetX}px, 0, 0)`,
              willChange: "transform",
            }}
          >
            {columns.slice(colStart, colEnd).map((col: any) => (
              <div
                key={col.id}
                style={{
                  width: col.width || 150,
                  height: HEADER_HEIGHT,
                  flexShrink: 0,
                  padding: "8px",
                  borderRight: "1px solid #eee",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  background: "#fafafa",
                }}
              >
                {col.header}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: HEADER_HEIGHT,
            left: 0,
            transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
            willChange: "transform",
          }}
        >
          {rows.slice(rowStart, rowEnd).map((row: any) => (
            <div
              key={row.id}
              style={{
                display: "flex",
                height: ROW_HEIGHT,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {columns.slice(colStart, colEnd).map((col: any) => (
                <div
                  key={col.id}
                  style={{
                    width: col.width || 150,
                    flexShrink: 0,
                    padding: "8px",
                    borderRight: "1px solid #f5f5f5",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {col.accessor(row.original)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
