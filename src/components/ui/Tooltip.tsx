import { Tooltip } from "antd";

export const SafeTooltip = ({ children, ...props }: any) => {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouch) return children;

  return (
    <Tooltip
      placement="top"
      arrow={{ pointAtCenter: true }}
      trigger={["hover"]}
      mouseEnterDelay={0.5}
      {...props}
    >
      {children}
    </Tooltip>
  );
};
