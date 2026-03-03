import { useState } from "react";

export interface CrudItem {
  key: string;
  [key: string]: any;
}

export const useCrudTable = <T extends CrudItem>(initialData: T[]) => {
  const [dataSource, setDataSource] = useState<T[]>(initialData);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const selectRow = (record: T) => {
    setSelectedRowKey((prev) => (prev === record.key ? null : record.key));
  };

  const addItem = (values: Omit<T, "key">) => {
    const newItem = {
      key: Date.now().toString(),
      ...values,
    } as T;

    setDataSource((prev) => [...prev, newItem]);
    setSelectedRowKey(null);
  };

  const editItem = (values: Partial<T>) => {
    if (!selectedRowKey) return;

    setDataSource((prev) =>
      prev.map((item) =>
        item.key === selectedRowKey ? { ...item, ...values } : item,
      ),
    );

    setSelectedRowKey(null);
  };

  const removeItem = () => {
    if (!selectedRowKey) return;

    setDataSource((prev) => prev.filter((item) => item.key !== selectedRowKey));

    setSelectedRowKey(null);
  };

  const selectedRow = dataSource.find((item) => item.key === selectedRowKey);

  return {
    dataSource,
    selectedRowKey,
    selectedRow,
    selectRow,
    addItem,
    editItem,
    removeItem,
    setDataSource,
  };
};
