import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Col, Button, Form, type FormInstance } from "antd";

interface FilterOption {
  label: string;
  value: string;
  render: () => React.ReactNode;
}

interface Props {
  options: FilterOption[];
  form: FormInstance;
  onChangeActiveCount?: (count: number) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export default function AddFilter({
  options,
  form,
  onChangeActiveCount,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChangeActiveCount?.(activeFilters.length);
  }, [activeFilters]);

  // Tính toán vị trí dropdown dựa theo trigger button
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  const handleOpen = () => {
    if (!open) {
      updatePosition();
    }
    setOpen((v) => !v);
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Cập nhật vị trí khi scroll hoặc resize
  useEffect(() => {
    if (!open) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [open, updatePosition]);

  const availableOptions = options.filter(
    (opt) => !activeFilters.includes(opt.value),
  );

  const handleAdd = (value: string) => {
    setActiveFilters((prev) => [...prev, value]);
    setOpen(false);
  };

  const handleClearAll = () => {
    form.resetFields();
    setActiveFilters([]);
    form.submit();
  };

  return (
    <>
      {activeFilters.map((filterValue) => {
        const filter = options.find((o) => o.value === filterValue);
        if (!filter) return null;

        return (
          <Col key={filterValue} xs={24} sm={12} md={8} lg={6} xl={4}>
            {filter.render()}
          </Col>
        );
      })}

      {availableOptions.length > 0 && (
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Form.Item label=" ">
            <div className="adidas-font">
              {/* Trigger button */}
              <div
                ref={triggerRef}
                onClick={handleOpen}
                className="
                  h-[32px]
                  px-[11px]
                  border
                  border-dashed
                  rounded-md
                  flex items-center justify-between
                  cursor-pointer
                  text-[#bababa]
                  hover:border-gray-400
                  bg-white
                "
              >
                <span className="tracking-wide">ADD FILTER</span>
                <span className="text-md font-bold text-[#857e7c]">+</span>
              </div>

              {open &&
                dropdownPos &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                      width: Math.max(dropdownPos.width, 370),
                      maxWidth: "90vw",
                      zIndex: 9999,
                    }}
                    className="
                      bg-white
                      border
                      border-[#dee2e6]
                      rounded-md
                      shadow-lg
                      p-1
                      max-h-[200px]
                      overflow-y-auto
                      adidas-font
                    "
                  >
                    {availableOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => handleAdd(opt.value)}
                        className="
                          h-[32px]
                          flex items-center
                          px-[11px]
                          cursor-pointer
                          border
                          border-[#dee2e6]
                          rounded
                          mb-1 last:mb-0
                          hover:bg-gray-50
                        "
                      >
                        <span
                          className="
                            flex-1
                            text-sm text-[#a6a7a5]
                            whitespace-nowrap
                            overflow-hidden
                            text-ellipsis
                          "
                        >
                          {opt.label}
                        </span>

                        <span className="ml-2 font-bold shrink-0 text-[#857e7c]">
                          +
                        </span>
                      </div>
                    ))}
                  </div>,
                  document.body,
                )}
            </div>
          </Form.Item>
        </Col>
      )}

      {activeFilters.length > 0 && (
        <Col xs={10} sm={8} md={6} lg={4} xl={2}>
          <Form.Item label=" ">
            <Button
              type="link"
              onClick={handleClearAll}
              style={{
                padding: 0,
                color: "gray",
                fontWeight: "bold",
              }}
            >
              Clear Filter ✕
            </Button>
          </Form.Item>
        </Col>
      )}
    </>
  );
}
