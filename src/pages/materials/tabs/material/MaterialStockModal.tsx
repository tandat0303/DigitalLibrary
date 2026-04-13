import { Modal, Table, Typography } from "antd";
import { useRef, useEffect } from "react";
import {
  mtlStockColumns,
  type MaterialStockModalProps,
  type MaterialStockRow,
} from "../../../../types/materials";
import { Warehouse } from "lucide-react";
import CustomPagination from "../../../../components/CustomPagination";
import { v4 as uuidv4 } from "uuid";

const { Text } = Typography;

export default function MaterialStockModal({
  open,
  onClose,
  suppMtlID,
  dataSource = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalQty: 0,
  },
  loading = false,
  current,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: MaterialStockModalProps) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const data = dataSource.data.map((item) => ({
    ...item,
    key: uuidv4(),
  }));

  // const totalQty = Number(
  //   data.reduce((sum, row) => sum + Number(row.Qty || 0), 0).toFixed(2),
  // );
  const totalQty = dataSource.totalQty;
  const totalColumns = mtlStockColumns.length;

  useEffect(() => {
    if (!tableWrapperRef.current) return;

    const scrollContainer =
      tableWrapperRef.current.querySelector<HTMLElement>(".ant-table-body");
    const totalRow = tableWrapperRef.current.querySelector<HTMLElement>(
      ".mtl-total-row-scroll",
    );

    if (!scrollContainer || !totalRow) return;

    const syncScroll = () => {
      totalRow.scrollLeft = scrollContainer.scrollLeft;
    };

    scrollContainer.addEventListener("scroll", syncScroll);
    return () => scrollContainer.removeEventListener("scroll", syncScroll);
  }, [open, data]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(90vw, 1500px)"
      title={
        <span
          style={{
            fontWeight: 600,
            letterSpacing: "0.02em",
            gap: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Warehouse className="w-5 h-5" />
          Stock Information —
          {suppMtlID && (
            <span style={{ fontWeight: 600, fontSize: 13, color: "#fc1717" }}>
              {suppMtlID}
            </span>
          )}
        </span>
      }
      styles={{
        body: { padding: "16px 0 0" },
        header: {
          padding: "0 0 12px",
          borderBottom: "1px solid #f0f0f0",
        },
      }}
      destroyOnHidden
      centered
    >
      <div ref={tableWrapperRef} style={{ position: "relative" }}>
        <Table<MaterialStockRow>
          loading={loading}
          bordered
          size="small"
          columns={mtlStockColumns}
          dataSource={data}
          rowKey="key"
          pagination={false}
          scroll={{ x: 800, y: 300 }}
          summary={() => (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row
                style={{
                  background: "#fafafa",
                  fontWeight: 700,
                }}
              >
                <Table.Summary.Cell
                  index={0}
                  colSpan={totalColumns - 1}
                  align="center"
                >
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#595959",
                    }}
                  >
                    Total
                  </Text>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={totalColumns - 1} align="center">
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#fc1717",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {/* {totalQty.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })} */}
                    {totalQty}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <CustomPagination
        total={dataSource.total}
        current={current}
        pageSize={pageSize}
        onChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Modal>
  );
}
