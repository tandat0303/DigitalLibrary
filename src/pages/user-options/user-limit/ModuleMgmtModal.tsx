import React from "react";
import CrudModal from "./CrudModal";
import {
  moduleColumns,
  moduleFields,
  type ModuleProps,
  type ModuleType,
} from "../../../types/users";
import { initialModuleData } from "../../../types/samples";

const ModuleMgmtModal: React.FC<ModuleProps> = ({ open, onClose }) => {
  return (
    <CrudModal<ModuleType>
      open={open}
      onClose={onClose}
      title="Module MGMT"
      fields={moduleFields}
      columns={moduleColumns}
      initialData={initialModuleData}
      buttonText={{
        add: "Add",
        refresh: "Refresh",
        edit: "Edit",
        remove: "Remove",
      }}
    />
  );
};

export default ModuleMgmtModal;
