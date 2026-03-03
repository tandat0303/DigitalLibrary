import { Form, Input } from "antd";

export const FILTER_OPTIONS = [
  {
    label: "Supplier",
    value: "supplier",
    render: () => (
      <Form.Item name="Supplier" label="Supplier">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Supplier material ID",
    value: "sup_mtl_id",
    render: () => (
      <Form.Item name="Supplier_Material_ID" label="Supplier material ID">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Supplier Material Name",
    value: "sup_mtl_name",
    render: () => (
      <Form.Item name="Supplier_Material_Name" label="Supplier Material Name">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Mtl - Supp Lifecycle State",
    value: "mtl_sup_lfcycle_state",
    render: () => (
      <Form.Item
        name="Mtl_Supp_Lifecycle_State"
        label="Mtl - Supp Lifecycle State"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Material Type Level 1",
    value: "mtl_type_lv_1",
    render: () => (
      <Form.Item name="Material_Type_Level_1" label="Material Type Level 1">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Composition",
    value: "composition",
    render: () => (
      <Form.Item name="Composition" label="Composition">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Classification",
    value: "classification",
    render: () => (
      <Form.Item name="Classification" label="Classification">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Material Thickness",
    value: "mtl_thick",
    render: () => (
      <Form.Item name="Material_Thickness" label="Material Thickness">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Comparison UOM",
    value: "comp_uom",
    render: () => (
      <Form.Item name="Comparison_UOM" label="Comparison UOM">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Price Remark",
    value: "price_remark",
    render: () => (
      <Form.Item name="Price_Remark" label="Price Remark">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Skin Size",
    value: "skin_size",
    render: () => (
      <Form.Item name="Skin_Size" label="Skin_Size">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "QC%",
    value: "qc_per",
    render: () => (
      <Form.Item name="QC_Percent" label="QC%">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Leadtime",
    value: "leadtime",
    render: () => (
      <Form.Item name="Leadtime" label="Leadtime">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Sample Leadtime",
    value: "sample_leadtime",
    render: () => (
      <Form.Item name="Sample_Leadtime" label="Sample Leadtime">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Min Qty/ Color",
    value: "min_qty_color",
    render: () => (
      <Form.Item name="Min_Qty_Color" label="Min Qty/ Color">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Min Qty/ Sample",
    value: "min_qty_sample",
    render: () => (
      <Form.Item name="Min_Qty_Sample" label="Min Qty/ Sample">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Production Location",
    value: "prod_locate",
    render: () => (
      <Form.Item name="Production_Location" label="Production Location">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Terms of Delivery per T1 Country",
    value: "term_deli_T1_country",
    render: () => (
      <Form.Item
        name="Terms_of_Delivery_per_T1_Country"
        label="Terms of Delivery per T1 Country"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Valid From (Price)",
    value: "valid_from_price",
    render: () => (
      <Form.Item name="Valid_From_Price" label="Valid From (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Valid To (Price)",
    value: "valid_to_price",
    render: () => (
      <Form.Item name="Valid_To_Price" label="Valid To (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Price Type",
    value: "price_type",
    render: () => (
      <Form.Item name="Price_Type" label="Price Type">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Color Code (Price)",
    value: "color_code_price",
    render: () => (
      <Form.Item name="Color_Code_Price" label="Color Code (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Color (Price)",
    value: "color_price",
    render: () => (
      <Form.Item name="Color_Price" label="Color (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Treatment (Price)",
    value: "treatment_price",
    render: () => (
      <Form.Item name="Treatment_Price" label="Treatment (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Width (Price)",
    value: "width_price",
    render: () => (
      <Form.Item name="Width_Price" label="Width (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Width Uom (Price)",
    value: "width_uom_price",
    render: () => (
      <Form.Item name="Width_Uom_Price" label="Width Uom (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Length (Price)",
    value: "length_price",
    render: () => (
      <Form.Item name="Length_Price" label="Length (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Length Uom (Price)",
    value: "length_uom_price",
    render: () => (
      <Form.Item name="Length_Uom_Price" label="Length Uom (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Thickness (Price)",
    value: "thick_price",
    render: () => (
      <Form.Item name="Thickness_Price" label="Thickness (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Thickness Uom (Price)",
    value: "thick_uom_price",
    render: () => (
      <Form.Item name="Thickness_Uom_Price" label="Thickness Uom (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Diameter Inside (Price)",
    value: "dmeter_inside_price",
    render: () => (
      <Form.Item name="Diameter_Inside_Price" label="Diameter Inside (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Diameter Inside Uom (Price)",
    value: "dmeter_inside_uom_price",
    render: () => (
      <Form.Item
        name="Diameter_Inside_Uom_Price"
        label="Diameter Inside Uom (Price)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Weight (Price)",
    value: "weight_price",
    render: () => (
      <Form.Item name="Weight_Price" label="Weight (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Weight Uom (Price)",
    value: "weight_uom_price",
    render: () => (
      <Form.Item name="Weight_Uom_Price" label="Weight Uom (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Quantity (Price)",
    value: "qty_price",
    render: () => (
      <Form.Item name="Quantity_Price" label="Quantity (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Quantity Uom (Price)",
    value: "qty_uom_price",
    render: () => (
      <Form.Item name="Quantity_Uom_Price" label="Quantity Uom (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Uom String (Price)",
    value: "uom_string_price",
    render: () => (
      <Form.Item name="Uom_String_Price" label="Uom String (Price)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "SS26 Final Price (USD)",
    value: "ss26_final_price_usd",
    render: () => (
      <Form.Item name="SS26_Final_Price_USD" label="SS26 Final Price (USD)">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Comparison Price (Price) (USD)",
    value: "comp_price_price_usd",
    render: () => (
      <Form.Item
        name="Comparison_Price_Price_USD"
        label="Comparison Price (Price) (USD)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Approved as Final Price Y/N (Price)",
    value: "approved_final_price_y_n_price",
    render: () => (
      <Form.Item
        name="Approved_As_Final_Price_Y_N_Price"
        label="Approved as Final Price Y/N (Price)"
      >
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "Season",
    value: "season",
    render: () => (
      <Form.Item name="Season" label="Season">
        <Input />
      </Form.Item>
    ),
  },
];
