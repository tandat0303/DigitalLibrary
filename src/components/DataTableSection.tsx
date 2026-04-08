import { Card, Col, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import CustomPagination from "./CustomPagination";
import TableActionBar, { type TableActionBarProps } from "./TableActionBar";
import type { TablePropsTyped } from "../lib/helpers";

export interface DataTableSectionProps<T extends object> {
  dataSource: T[];
  columns: ColumnsType<T>;
  rowKey: keyof T | ((record: T) => string);
  loading?: boolean;
  selectedRowKey?: string | null;
  onRowClick?: (record: T) => void;
  selectedRowClassName?: string;
  /** Hỗ trợ checkbox selection (multi-select) — tuỳ chọn */
  rowSelection?: TableRowSelection<T>;

  actionBar?: TableActionBarProps;

  total: number;
  current: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  /** Độ rộng Col (mặc định 24) */
  colSpan?: number;
  /** Thêm props vào Table nếu cần (scroll, size, ...) */
  tableProps?: TablePropsTyped<T>;

  rowClassNameFn?: (record: T) => string;
}

function getRowKey<T extends object>(
  rowKey: DataTableSectionProps<T>["rowKey"],
): (record: T) => string {
  if (typeof rowKey === "function") return rowKey;
  return (record: T) => String(record[rowKey]);
}

/**
 * DataTableSection — Card wrapper gồm ActionBar + Table + Pagination.
 *
 * @example
 * <DataTableSection
 *   dataSource={flatData}
 *   columns={columns}
 *   rowKey="_flatKey"
 *   loading={loading}
 *   selectedRowKey={selectedID}
 *   onRowClick={handleSelectItem}
 *   total={total}
 *   current={current}
 *   pageSize={pageSize}
 *   onPageChange={setCurrent}
 *   onPageSizeChange={setPageSize}
 *   actionBar={{
 *     totalLabel: `${total} items`,
 *     buttons: [
 *       { label: "NEW ITEM",    className: "add-btn",    tooltip: "Create", onClick: handleCreate },
 *       { label: "EDIT ITEM",   className: "edit-btn",   tooltip: "Edit",   onClick: handleEdit   },
 *       { label: "REMOVE ITEM", className: "delete-btn", tooltip: "Delete", onClick: confirmRemove },
 *     ],
 *   }}
 * />
 */
export default function DataTableSection<T extends object>({
  dataSource,
  columns,
  rowKey,
  loading = false,
  selectedRowKey,
  onRowClick,
  selectedRowClassName = "custom-selected-row",
  rowSelection,
  actionBar,
  total,
  current,
  pageSize,
  onPageChange,
  onPageSizeChange,
  colSpan = 24,
  tableProps,
  rowClassNameFn,
}: DataTableSectionProps<T>) {
  const resolvedRowKey = getRowKey(rowKey);

  return (
    <Row gutter={24}>
      <Col span={colSpan}>
        <Card
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          styles={{
            body: { flex: 1, display: "flex", flexDirection: "column" },
          }}
        >
          {/* ── Action buttons ── */}
          {actionBar && <TableActionBar {...actionBar} />}

          {/* ── Table ── */}
          <div className="w-full mt-1">
            <Table<T>
              loading={loading}
              bordered
              columns={columns}
              dataSource={dataSource}
              rowKey={resolvedRowKey}
              pagination={false}
              scroll={{ x: "max-content" }}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => onRowClick?.(record),
                style: { cursor: onRowClick ? "pointer" : "default" },
              })}
              rowClassName={(record) => {
                if (rowClassNameFn) return rowClassNameFn(record);
                if (!selectedRowKey) return "";
                return resolvedRowKey(record) === selectedRowKey
                  ? selectedRowClassName
                  : "";
              }}
              {...tableProps}
            />
          </div>

          <CustomPagination
            total={total}
            current={current}
            pageSize={pageSize}
            onChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </Card>
      </Col>
    </Row>
  );
}
