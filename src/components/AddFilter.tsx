import { useEffect, useRef, useState } from "react";
import { Col, Button, Form } from "antd";

interface FilterOption {
  label: string;
  value: string;
  render: () => React.ReactNode;
}

interface Props {
  options: FilterOption[];
  form: any;
  onChangeActiveCount?: (count: number) => void;
}

export default function AddFilter({
  options,
  form,
  onChangeActiveCount,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChangeActiveCount?.(activeFilters.length);
  }, [activeFilters]);

  // click outside close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableOptions = options.filter(
    (opt) => !activeFilters.includes(opt.value),
  );

  const handleAdd = (value: string) => {
    setActiveFilters((prev) => [...prev, value]);
    setOpen(false);
  };

  const handleClearAll = () => {
    form.resetFields(activeFilters);
    setActiveFilters([]);
  };

  return (
    <>
      {activeFilters.map((filterValue) => {
        const filter = options.find((o) => o.value === filterValue);
        if (!filter) return null;

        return (
          <Col key={filterValue} flex="220px">
            {filter.render()}
          </Col>
        );
      })}

      {availableOptions.length > 0 && (
        <Col flex="220px">
          <Form.Item label=" ">
            <div ref={dropdownRef} className="relative adidas-font">
              <div
                onClick={() => setOpen((v) => !v)}
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

              {open && (
                <div
                  className="
                    absolute z-50 mt-2
                    w-[370px]
                    bg-white
                    border
                    border-[#dee2e6]
                    rounded-md
                    shadow-lg
                    p-1
                    max-h-[200px]
                    overflow-y-auto
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
                </div>
              )}
            </div>
          </Form.Item>
        </Col>
      )}

      {activeFilters.length > 0 && (
        <Col flex="120px">
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
