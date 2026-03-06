export function buildQueryFilters(values: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([_, v]) => v !== undefined && v !== "" && v !== null)
      .map(([key, value]) => {
        const newKey = key.charAt(0).toLowerCase() + key.slice(1);
        return [newKey, value];
      }),
  );
}
