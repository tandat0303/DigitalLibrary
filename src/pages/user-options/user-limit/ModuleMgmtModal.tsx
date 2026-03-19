import React from "react";
import CrudModal from "./CrudModal";
import {
  moduleColumns,
  moduleFields,
  type ModalProps,
  type ModuleType,
} from "../../../types/users";
import moduleMgmtApi from "../../../api/moduleMgmt.api";

const ModuleMgmtModal: React.FC<ModalProps> = ({ open, onClose }) => {
  return (
    <CrudModal<ModuleType>
      open={open}
      onClose={onClose}
      topic="module"
      title="Module MGMT"
      fields={moduleFields}
      columns={moduleColumns}
      idField="ModuleID"
      buttonText={{
        add: "Add",
        refresh: "Refresh",
        edit: "Edit",
        remove: "Remove",
      }}
      apiHandlers={{
        onFetch: async () => {
          const res = await moduleMgmtApi.getAllModules();
          return res;
        },
        onCreate: async (data) => {
          const res = await moduleMgmtApi.createModule(data as ModuleType);
          return res;
        },
        onUpdate: async (id, data) => {
          const res = await moduleMgmtApi.updateModule(id, data as ModuleType);
          return res;
        },
        onDelete: async (id) => {
          const res = await moduleMgmtApi.deleteModule(id);
          return res;
        },
      }}
    />
  );
};

export default ModuleMgmtModal;
