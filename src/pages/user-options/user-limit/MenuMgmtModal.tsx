import React, { useEffect, useState } from "react";
import CrudModal from "./CrudModal";
import {
  menuColumns,
  getMenuFields,
  type MenuType,
  type ModalProps,
  type ModuleType,
} from "../../../types/users";
import moduleMgmtApi from "../../../api/moduleMgmt.api";
import menuMgmtApi from "../../../api/menuMgmt.api";

const MenuMgmtModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [moduleOptions, setModuleOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchModules = async () => {
      const modules = await moduleMgmtApi.getAllModules();

      const options = modules.map((m: ModuleType) => ({
        label: m.Name_EN,
        value: m.ModuleID,
      }));

      setModuleOptions(options);
    };

    fetchModules();
  }, [open]);

  return (
    <CrudModal<MenuType>
      open={open}
      onClose={onClose}
      topic="menu"
      title="Menu MGMT"
      fields={getMenuFields(moduleOptions)}
      columns={menuColumns}
      idField="MenuID"
      buttonText={{
        add: "Add",
        refresh: "Refresh",
        edit: "Edit",
        remove: "Remove",
      }}
      apiHandlers={{
        onFetch: async () => {
          const res = await menuMgmtApi.getAllMenus();
          return res;
        },
        onCreate: async (data) => {
          const res = await menuMgmtApi.createMenu(data as MenuType);
          return res;
        },
        onUpdate: async (id, data) => {
          const res = await menuMgmtApi.updateMenu(id, data as MenuType);
          return res;
        },
        onDelete: async (id) => {
          const res = await menuMgmtApi.deleteMenu(id);
          return res;
        },
      }}
    />
  );
};

export default MenuMgmtModal;
