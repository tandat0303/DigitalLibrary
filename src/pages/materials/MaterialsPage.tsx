import { Tabs } from "antd";
import { useState } from "react";
import MaterialsContent from "../materials/tabs/material/MaterialContent";

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState("materials");

  return (
    <Tabs
      accessKey={activeTab}
      onChange={setActiveTab}
      items={[
        {
          key: "materials",
          label: "Materials",
          children: <MaterialsContent />,
        },
      ]}
    />
  );
}
