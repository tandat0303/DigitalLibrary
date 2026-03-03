import { Select } from "antd";
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

interface Props {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function CustomPagination({
  total,
  current,
  pageSize,
  onChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  const generatePages = () => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 7) {
      // Nếu ít page thì show hết luôn
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const left = Math.max(2, current - delta);
    const right = Math.min(totalPages - 1, current + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <div
      style={{
        borderTop: "1px solid #f0f0f0",
        padding: "12px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="adidas-font"
    >
      <div>
        {(current - 1) * pageSize + 1}-{Math.min(current * pageSize, total)} of{" "}
        {total} items
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <DoubleLeftOutlined
          style={{
            cursor: current === 1 ? "not-allowed" : "pointer",
            opacity: current === 1 ? 0.4 : 1,
          }}
          onClick={() => current !== 1 && onChange(1)}
        />

        <LeftOutlined
          style={{
            cursor: current === 1 ? "not-allowed" : "pointer",
            opacity: current === 1 ? 0.4 : 1,
          }}
          onClick={() => current > 1 && onChange(current - 1)}
        />

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} style={{ padding: "0 6px" }}>
              ...
            </span>
          ) : (
            <div
              key={`page-${page}`}
              onClick={() => onChange(page)}
              style={{
                minWidth: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                cursor: "pointer",
                background: page === current ? "#1677ff" : "#fff",
                color: page === current ? "#fff" : "#000",
                border: "1px solid #d9d9d9",
              }}
            >
              {page}
            </div>
          ),
        )}

        <RightOutlined
          style={{
            cursor: current === totalPages ? "not-allowed" : "pointer",
            opacity: current === totalPages ? 0.4 : 1,
          }}
          onClick={() => current < totalPages && onChange(current + 1)}
        />

        <DoubleRightOutlined
          style={{
            cursor: current === totalPages ? "not-allowed" : "pointer",
            opacity: current === totalPages ? 0.4 : 1,
          }}
          onClick={() => current !== totalPages && onChange(totalPages)}
        />

        <Select
          className="adidas-font"
          value={pageSize}
          style={{ width: 80, marginLeft: 10 }}
          onChange={(value) => {
            onPageSizeChange(value);
            onChange(1);
          }}
          options={[
            { value: 10, label: "10" },
            { value: 25, label: "25" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
        />

        <span className="adidas-font">entries per page</span>
      </div>
    </div>
  );
}
