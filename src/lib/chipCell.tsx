import { Modal, Tag } from "antd";

export default function ChipCell({
  items,
  label,
  color,
  maxChips,
}: {
  items: string[];
  label: string;
  color: "blue" | "green";
  maxChips: number;
}) {
  if (!items || items.length === 0)
    return <span className="text-gray-300">—</span>;

  const visible = items.slice(0, maxChips);
  const hidden = items.length - maxChips;

  const openListModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.info({
      title: `${label} (${items.length})`,
      centered: true,
      width: 360,
      okText: "Close",
      content: (
        <div style={{ maxHeight: 320, overflowY: "auto", marginTop: 8 }}>
          {items.map((item) => (
            <div key={item} style={{ padding: "4px 0" }}>
              <Tag color={color} style={{ margin: 0 }}>
                {item}
              </Tag>
            </div>
          ))}
        </div>
      ),
    });
  };

  return (
    <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
      {visible.map((item) => (
        <Tag
          key={item}
          color={color}
          className="cursor-pointer"
          onClick={openListModal}
          style={{ margin: 0 }}
        >
          {item}
        </Tag>
      ))}
      {hidden > 0 && (
        <Tag
          className="cursor-pointer"
          onClick={openListModal}
          style={{ margin: 0 }}
        >
          +{hidden} more
        </Tag>
      )}
    </div>
  );
}
