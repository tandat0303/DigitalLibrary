import React from "react";
import CrudModal from "./CrudModal";
import {
  menuColumns,
  menuFields,
  type MenuType,
  type ModalProps,
} from "../../../types/users";
import { initialMenuData } from "../../../types/samples";

const MenuMgmtModal: React.FC<ModalProps> = ({ open, onClose }) => {
  return (
    <CrudModal<MenuType>
      open={open}
      onClose={onClose}
      title="Menu MGMT"
      fields={menuFields}
      columns={menuColumns}
      initialData={initialMenuData}
      buttonText={{
        add: "Add",
        refresh: "Refresh",
        edit: "Edit",
        remove: "Remove",
      }}
    />
  );
};

export default MenuMgmtModal;
