export function buildQueryFilters(values: Record<string, any>) {
  const normalizeKey = (key: string) =>
    key
      .split("_")
      .map((p, i) =>
        i === 0
          ? p.charAt(0).toLowerCase() + p.slice(1)
          : p.charAt(0).toUpperCase() + p.slice(1),
      )
      .join("");

  return Object.fromEntries(
    Object.entries(values)
      .filter(([_, v]) => v != null && v !== "")
      .map(([k, v]) => [normalizeKey(k), v]),
  );
}
