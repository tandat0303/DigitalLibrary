import { Button, Space } from "antd";
import { type ButtonProps } from "antd";
import { type ReactNode } from "react";
import { SafeTooltip } from "../components/ui/Tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionButtonConfig {
  label?: ReactNode;
  tooltip?: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
  buttonProps?: Omit<ButtonProps, "onClick" | "disabled" | "className">;
}

export interface TableActionBarProps {
  buttons: ActionButtonConfig[];
  totalLabel?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * TableActionBar — dải button CRUD có thể custom hoàn toàn.
 *
 * @example
 * <TableActionBar
 *   totalLabel={`${total} items`}
 *   buttons={[
 *     { label: "NEW ITEM",    tooltip: "Create new",  className: "add-btn",    onClick: handleCreate },
 *     { label: "EDIT ITEM",   tooltip: "Edit item",   className: "edit-btn",   onClick: handleEdit   },
 *     { label: "REMOVE ITEM", tooltip: "Delete item", className: "delete-btn", onClick: confirmRemove },
 *     { label: <Upload />,    tooltip: "Import Excel",className: "actions-btn",onClick: () => setOpenImport(true) },
 *   ]}
 * />
 */
export default function TableActionBar({
  buttons,
  totalLabel,
}: TableActionBarProps) {
  const visibleButtons = buttons.filter((b) => !b.hidden);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
      <Space wrap className="w-full [&>*]:w-full lg:w-auto lg:[&>*]:w-auto">
        {visibleButtons.map((btn, idx) => (
          <SafeTooltip key={idx} title={btn.tooltip ?? ""}>
            <Button
              className={`${btn.className ?? ""} w-full lg:w-auto`}
              onClick={btn.onClick}
              disabled={btn.disabled}
              icon={btn.icon}
              {...btn.buttonProps}
            >
              <div className="flex items-center gap-1">{btn.label}</div>
            </Button>
          </SafeTooltip>
        ))}
      </Space>

      {totalLabel !== undefined && (
        <span className="adidas-font text-left lg:text-right">
          {totalLabel}
        </span>
      )}
    </div>
  );
}
