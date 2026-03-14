interface ShineProps {
  children: React.ReactNode;
}

export const ShineText = ({ children }: ShineProps) => {
  return <span className="shine-text">{children}</span>;
};
