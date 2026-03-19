import { useState } from "react";

export interface CrudItem {
  [key: string]: any;
}

export const useCrudTable = <T extends CrudItem>(idField: keyof T) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<T[keyof T] | null>(null);

  const clearSelection = () => {
    setSelectedRowId(null);
  };

  const selectRow = (record: T) => {
    const id = record[idField];

    setSelectedRowId((prev) => (prev === id ? null : id));
  };

  const selectedRow = dataSource.find(
    (item) => item[idField] === selectedRowId,
  );

  return {
    dataSource,
    setDataSource,
    selectedRowId,
    selectedRow,
    selectRow,
    clearSelection,
    idField,
  };
};
