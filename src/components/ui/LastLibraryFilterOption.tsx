import { Form, Input } from "antd";

export const FILTER_OPTIONS = [
  {
    label: "Season (M)",
    value: "season_m",
    render: () => (
      <Form.Item name="Season_M" label="Season (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Last (M)",
    value: "last_m",
    render: () => (
      <Form.Item name="Last_M" label="Last (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Creation Workflow (M)",
    value: "creation_workflow_m",
    render: () => (
      <Form.Item name="Creation_Workflow_M" label="Creation Workflow (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Modal Number (M)",
    value: "modal_num_m",
    render: () => (
      <Form.Item name="Modal_Number_M" label="Modal Number (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Article Number (A)",
    value: "article_num_A",
    render: () => (
      <Form.Item name="Article_Number_A" label="Article Number (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Modal Name Short (M)",
    value: "modal_name_short_M",
    render: () => (
      <Form.Item name="Modal_Name_Short_M" label="Modal Name Short (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Sports Category (M)",
    value: "sports_cat_m",
    render: () => (
      <Form.Item name="Sports_Category_M" label="Sports Category (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Development Type (A)",
    value: "dev_type_a",
    render: () => (
      <Form.Item name="Development_Type_A" label="Development Type (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Group Name (A)",
    value: "group_name_a",
    render: () => (
      <Form.Item name="Group_Name_A" label="Group Name (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Development Factory (M)",
    value: "dev_fac_m",
    render: () => (
      <Form.Item name="Development_Factory_M" label="Development Factory (M)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Digital Scope (A)",
    value: "digi_scope_a",
    render: () => (
      <Form.Item name="Digital_Scope_A" label="Digital Scope (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Digital Scope Update Date (A)",
    value: "digi_scope_update_date_a",
    render: () => (
      <Form.Item
        name="Digital_Scope_Update_Date_A"
        label="Digital Scope Update Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Marketing Department (A)",
    value: "market_dept_a",
    render: () => (
      <Form.Item name="Marketing_Department_A" label="Marketing Department (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Preview Final Rendering available Downstream Date (A)",
    value: "prev_final_render_available_downs_date_a",
    render: () => (
      <Form.Item
        name="Preview_Final_Rendering_available_Downstream_Date_A"
        label="Preview Final Rendering available Downstream Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Pre-sell Final Rendering available Downstream Date (A)",
    value: "pres_final_render_available_downs_date_a",
    render: () => (
      <Form.Item
        name="Presell_Final_Rendering_available_Downstream_Date_A"
        label="Pre-sell Final Rendering available Downstream Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "SMS Final Rendering available Downstream Date (A)",
    value: "sms_final_render_available_downs_date_a",
    render: () => (
      <Form.Item
        name="Sms_Final_Rendering_available_Downstream_Date_A"
        label="SMS Final Rendering available Downstream Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "MCS Final Rendering available Downstream Date (A)",
    value: "mcs_final_render_available_downs_date_a",
    render: () => (
      <Form.Item
        name="Mcs_Final_Rendering_Available_Downstream_Date_A"
        label="MCS Final Rendering available Downstream Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Article Status (A)",
    value: "article_stat_a",
    render: () => (
      <Form.Item name="Article_Status_A" label="Article Status (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Carry Over Season (A)",
    value: "carry_over_season_a",
    render: () => (
      <Form.Item name="Carry_Over_Season_A" label="Carry Over Season (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Consumer Testing (A)",
    value: "consumer_test_a",
    render: () => (
      <Form.Item name="Consumer_Testing_A" label="Consumer Testing (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Image Launch Date (A)",
    value: "img_launch_date_a",
    render: () => (
      <Form.Item name="Image_Launch_Date_A" label="Image Launch Date (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Developer (A)",
    value: "dev_a",
    render: () => (
      <Form.Item name="Developer_A" label="Developer (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Senior Developer (A)",
    value: "senior_dev_a",
    render: () => (
      <Form.Item name="Senior_Developer_A" label="Senior Developer (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Drop Date (A)",
    value: "drop_date_a",
    render: () => (
      <Form.Item name="Drop_Date_A" label="Drop Date (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "3D Factory (A)",
    value: "3d_factory_a",
    render: () => (
      <Form.Item name="Factory_3d_A" label="3D Factory (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Tags (A)",
    value: "tags_a",
    render: () => (
      <Form.Item name="Tags_A" label="Tags (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Preview Approval/Publish Date (A)",
    value: "prev_approval_pub_date_a",
    render: () => (
      <Form.Item
        name="Preview_Approval_Publish_Date_A"
        label="Preview Approval/Publish Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Pre-sell Approval/Publish Date (A)",
    value: "pres_approval_pub_date_a",
    render: () => (
      <Form.Item
        name="Presell_Approval_Publish_Date_A"
        label="Pre-sell Approval/Publish Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "SMS Approval/Publish Date (A)",
    value: "sms_approval_pub_date_a",
    render: () => (
      <Form.Item
        name="Sms_Approval_Publish_Date_A"
        label="SMS Approval/Publish Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "MCS Approval/Publish Date (A)",
    value: "mcs_approval_pub_date_a",
    render: () => (
      <Form.Item
        name="Mcs_Approval_Publish_Date_A"
        label="MCS Approval/Publish Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Published by (A)",
    value: "pub_by_a",
    render: () => (
      <Form.Item name="Published_by_A" label="Published by (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Published Milestone Timestamp (A)",
    value: "pub_miles_time_a",
    render: () => (
      <Form.Item
        name="Published_Milestone_Timestamp_A"
        label="Published Milestone Timestamp (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Published Milestone (A)",
    value: "pub_miles_a",
    render: () => (
      <Form.Item name="Published_Milestone_A" label="Published Milestone (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "HQ Render Status Timestamp (A)",
    value: "hq_render_stat_times_a",
    render: () => (
      <Form.Item
        name="Hq_Render_Status_Timestamp_A"
        label="HQ Render Status Timestamp (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "HQ Render Status (A)",
    value: "hq_render_stat_a",
    render: () => (
      <Form.Item name="Hq_Render_Status_A" label="HQ Render Status (A)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Design Sketch Latest Update (A)",
    value: "design_sketch_latest_update_a",
    render: () => (
      <Form.Item
        name="Design_Sketch_Latest_Update_A"
        label="Design Sketch Latest Update (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Feasibility Checked Date (A)",
    value: "fea_check_date_a",
    render: () => (
      <Form.Item
        name="Feasibility_Checked_Date_A"
        label="Feasibility Checked Date (A)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Image Confidential (A)",
    value: "img_confident_a",
    render: () => (
      <Form.Item name="Image_Confidential_A" label="Image Confidential (A)">
        <Input />
      </Form.Item>
    ),
  },
];
