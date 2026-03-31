// import { Button, Col, Form, Grid, Input, Modal, Row, Tag, Tooltip } from "antd";
// import { FileBox, Plus, Trash2, Upload, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { AppAlert } from "../../components/ui/AppAlert";
// import type {
//   LastLibraryModalProps,
//   RefModelEntry,
//   SizeEntry,
// } from "../../types/lastLibrary";

// interface SizeRow {
//   id: string;
//   file: File | null; // the .3dm file — its name becomes the size label
//   sizeName: string; // derived from file.name (no extension)
//   refModels: RefModelRowItem[];
// }

// interface RefModelRowItem {
//   id: string;
//   model: string;
//   articles: string[]; // list of article strings
//   articleInput: string; // current text in the article input
// }

// function makeDefaultSizeRow(): SizeRow {
//   return {
//     id: uid(),
//     file: null,
//     sizeName: "",
//     refModels: [makeDefaultRefModelRow()],
//   };
// }

// function makeDefaultRefModelRow(): RefModelRowItem {
//   return { id: uid(), model: "", articles: [], articleInput: "" };
// }

// function RefModelRow({
//   item,
//   onChange,
//   onRemove,
//   canRemove,
// }: {
//   item: RefModelRowItem;
//   onChange: (updated: RefModelRowItem) => void;
//   onRemove: () => void;
//   canRemove: boolean;
// }) {
//   const addArticle = () => {
//     const val = item.articleInput.trim();
//     if (!val) return;
//     if (item.articles.includes(val)) return;
//     onChange({ ...item, articles: [...item.articles, val], articleInput: "" });
//   };

//   const removeArticle = (art: string) => {
//     onChange({ ...item, articles: item.articles.filter((a) => a !== art) });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: 8,
//         alignItems: "flex-start",
//         padding: "6px 0",
//       }}
//     >
//       {/* Ref Model input */}
//       <div style={{ width: 160, flexShrink: 0 }}>
//         <Input
//           size="small"
//           placeholder="Ref Model"
//           value={item.model}
//           onChange={(e) => onChange({ ...item, model: e.target.value })}
//         />
//       </div>

//       {/* Ref Articles */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             display: "flex",
//             gap: 6,
//             flexWrap: "wrap",
//             marginBottom: item.articles.length ? 4 : 0,
//           }}
//         >
//           {item.articles.map((art) => (
//             <Tag
//               key={art}
//               color="green"
//               closable
//               onClose={() => removeArticle(art)}
//               style={{ margin: 0 }}
//             >
//               {art}
//             </Tag>
//           ))}
//         </div>
//         <div style={{ display: "flex", gap: 6 }}>
//           <Input
//             size="small"
//             placeholder="Add Ref Article & press Enter"
//             value={item.articleInput}
//             onChange={(e) =>
//               onChange({ ...item, articleInput: e.target.value })
//             }
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 addArticle();
//               }
//             }}
//           />
//           <Button size="small" onClick={addArticle} icon={<Plus size={12} />} />
//         </div>
//       </div>

//       {/* Remove row */}
//       {canRemove && (
//         <Tooltip title="Remove ref model">
//           <Button
//             size="small"
//             danger
//             type="text"
//             icon={<X size={14} />}
//             onClick={onRemove}
//             style={{ flexShrink: 0 }}
//           />
//         </Tooltip>
//       )}
//     </div>
//   );
// }

// function SizeCard({
//   sizeRow,
//   index,
//   onChange,
//   onRemove,
//   canRemove,
// }: {
//   sizeRow: SizeRow;
//   index: number;
//   onChange: (updated: SizeRow) => void;
//   onRemove: () => void;
//   canRemove: boolean;
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     onChange({
//       ...sizeRow,
//       file,
//       sizeName: file ? stripExt(file.name) : "",
//     });
//     // reset so same file can be re-selected if needed
//     e.target.value = "";
//   };

//   const handleRemoveFile = () => {
//     onChange({ ...sizeRow, file: null, sizeName: "" });
//   };

//   const updateRefModel = (refId: string, updated: RefModelRowItem) => {
//     onChange({
//       ...sizeRow,
//       refModels: sizeRow.refModels.map((r) => (r.id === refId ? updated : r)),
//     });
//   };

//   const removeRefModel = (refId: string) => {
//     onChange({
//       ...sizeRow,
//       refModels: sizeRow.refModels.filter((r) => r.id !== refId),
//     });
//   };

//   const addRefModel = () => {
//     onChange({
//       ...sizeRow,
//       refModels: [...sizeRow.refModels, makeDefaultRefModelRow()],
//     });
//   };

//   return (
//     <div
//       style={{
//         border: "1px solid #e5e7eb",
//         borderRadius: 8,
//         padding: "10px 14px",
//         background: "#fafafa",
//         position: "relative",
//       }}
//     >
//       {/* Card header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           marginBottom: 8,
//         }}
//       >
//         <span
//           style={{
//             fontSize: 11,
//             fontWeight: 600,
//             color: "#6b7280",
//             textTransform: "uppercase",
//             letterSpacing: "0.05em",
//             minWidth: 52,
//           }}
//         >
//           Size {index + 1}
//         </span>

//         {/* File upload zone */}
//         {sizeRow.file ? (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               background: "#eff6ff",
//               border: "1px solid #bfdbfe",
//               borderRadius: 6,
//               padding: "3px 10px",
//               flex: 1,
//               minWidth: 0,
//             }}
//           >
//             <FileBox size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
//             <span
//               style={{
//                 fontSize: 13,
//                 color: "#1d4ed8",
//                 fontWeight: 500,
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {sizeRow.file.name}
//             </span>
//             <Tag
//               color="blue"
//               style={{ margin: "0 0 0 auto", flexShrink: 0, fontWeight: 600 }}
//             >
//               {sizeRow.sizeName}
//             </Tag>
//             <Tooltip title="Remove file">
//               <Button
//                 size="small"
//                 type="text"
//                 danger
//                 icon={<X size={12} />}
//                 onClick={handleRemoveFile}
//                 style={{ flexShrink: 0 }}
//               />
//             </Tooltip>
//           </div>
//         ) : (
//           <Button
//             size="small"
//             icon={<Upload size={13} />}
//             onClick={() => fileInputRef.current?.click()}
//             style={{ fontSize: 12 }}
//           >
//             Upload .3DM file
//           </Button>
//         )}

//         {/* Remove size card */}
//         {canRemove && (
//           <Tooltip title="Remove size">
//             <Button
//               size="small"
//               danger
//               icon={<Trash2 size={13} />}
//               onClick={onRemove}
//               style={{ marginLeft: "auto", flexShrink: 0 }}
//             />
//           </Tooltip>
//         )}

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".3dm"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//       </div>

//       {/* Column headers for ref model section */}
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           padding: "0 0 4px",
//           borderBottom: "1px dashed #e5e7eb",
//           marginBottom: 4,
//         }}
//       >
//         <span
//           style={{
//             width: 160,
//             flexShrink: 0,
//             fontSize: 11,
//             color: "#9ca3af",
//             fontWeight: 600,
//             textTransform: "uppercase",
//           }}
//         >
//           Ref Model
//         </span>
//         <span
//           style={{
//             flex: 1,
//             fontSize: 11,
//             color: "#9ca3af",
//             fontWeight: 600,
//             textTransform: "uppercase",
//           }}
//         >
//           Ref Articles
//         </span>
//       </div>

//       {/* Ref model rows */}
//       {sizeRow.refModels.map((ref) => (
//         <RefModelRow
//           key={ref.id}
//           item={ref}
//           onChange={(updated) => updateRefModel(ref.id, updated)}
//           onRemove={() => removeRefModel(ref.id)}
//           canRemove={sizeRow.refModels.length > 1}
//         />
//       ))}

//       {/* Add ref model */}
//       <Button
//         size="small"
//         type="dashed"
//         icon={<Plus size={12} />}
//         onClick={addRefModel}
//         style={{ marginTop: 6, fontSize: 12 }}
//       >
//         Add Ref Model
//       </Button>
//     </div>
//   );
// }

// export default function LastLibraryModal({
//   open,
//   mode,
//   initialValues,
//   onCancel,
//   onSubmit,
// }: LastLibraryModalProps) {
//   const { useBreakpoint } = Grid;
//   const screens = useBreakpoint();
//   const isMobile = !screens.md;
//   const isTablet = screens.md && !screens.lg;

//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [sizeRows, setSizeRows] = useState<SizeRow[]>([makeDefaultSizeRow()]);

//   const formValues = Form.useWatch([], form);
//   const isFormEmpty =
//     mode === "create" &&
//     (!formValues ||
//       Object.values(formValues).every(
//         (v) => v === undefined || v === null || v === "",
//       )) &&
//     sizeRows.every((s) => !s.file && s.refModels.every((r) => !r.model));

//   // ---- seed from initialValues on edit ----
//   useEffect(() => {
//     if (!open) return;

//     if (mode === "edit" && initialValues) {
//       form.setFieldsValue({ ...initialValues });

//       // Rebuild sizeRows from initialValues.Sizes if present
//       if (initialValues.Sizes?.length) {
//         setSizeRows(
//           initialValues.Sizes.map((s: SizeEntry) => ({
//             id: uid(),
//             file: null,
//             sizeName: s.size,
//             refModels: s.refModels.map((r: RefModelEntry) => ({
//               id: uid(),
//               model: r.model,
//               articles: r.articles,
//               articleInput: "",
//             })),
//           })),
//         );
//       } else {
//         setSizeRows([makeDefaultSizeRow()]);
//       }
//     } else {
//       form.resetFields();
//       setSizeRows([makeDefaultSizeRow()]);
//     }
//   }, [open, mode, initialValues, form]);

//   const addSizeRow = () =>
//     setSizeRows((prev) => [...prev, makeDefaultSizeRow()]);

//   const updateSizeRow = (id: string, updated: SizeRow) => {
//     setSizeRows((prev) => prev.map((s) => (s.id === id ? updated : s)));
//   };

//   const removeSizeRow = (id: string) => {
//     setSizeRows((prev) => prev.filter((s) => s.id !== id));
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       // Build Sizes from state
//       const Sizes: SizeEntry[] = sizeRows.map((s) => ({
//         size: s.sizeName || s.file?.name || "",
//         file: s.file ?? undefined,
//         refModels: s.refModels.map((r) => ({
//           model: r.model,
//           articles: r.articles,
//         })),
//       }));

//       setLoading(true);
//       await onSubmit({ ...values, Sizes });
//       console.log({ ...values, Sizes });
//     } catch (error) {
//       console.log(error);
//       AppAlert({ icon: "error", title: "Please fill all fields" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (loading) return;
//     form.resetFields();
//     setSizeRows([makeDefaultSizeRow()]);
//     onCancel();
//   };

//   return (
//     <Modal
//       title={mode === "create" ? "New Item" : "Edit Item"}
//       open={open}
//       onCancel={handleClose}
//       footer={null}
//       destroyOnHidden
//       width={isMobile ? "100%" : isTablet ? 900 : 1200}
//       style={{ top: isMobile ? 0 : 20, padding: 0 }}
//       styles={{
//         body: {
//           padding: 0,
//           height: "calc(90vh - 55px)",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//       centered={!isMobile}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           flex: 1,
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "14px 24px 10px",
//             borderBottom: "1px solid #f0f0f0",
//             flexShrink: 0,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 13,
//               fontWeight: 700,
//               color: "#374151",
//               textTransform: "uppercase",
//               letterSpacing: "0.05em",
//             }}
//           >
//             Sizes &amp; Ref Models
//           </span>
//           <Button
//             size="small"
//             type="dashed"
//             icon={<Plus size={13} />}
//             onClick={addSizeRow}
//           >
//             Add Size
//           </Button>
//         </div>

//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             overflowX: "hidden",
//             padding: "16px 24px",
//           }}
//         >
//           {/* Size cards */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 10,
//               marginBottom: 16,
//             }}
//           >
//             {sizeRows.map((sr, idx) => (
//               <SizeCard
//                 key={sr.id}
//                 sizeRow={sr}
//                 index={idx}
//                 onChange={(updated) => updateSizeRow(sr.id, updated)}
//                 onRemove={() => removeSizeRow(sr.id)}
//                 canRemove={sizeRows.length > 1}
//               />
//             ))}
//           </div>

//           <div style={{ borderTop: "1px dashed #e5e7eb", marginBottom: 16 }} />
//           <Form form={form} layout="vertical">
//             <Row gutter={24}>
//               <Col span={24}>
//                 <div style={{ width: "100%" }}>
//                   <Row gutter={[24, 1]}>
//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Season (M)" name="Season_M">
//                         <Input placeholder="Season (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Creation Workflow (M)"
//                         name="Creation_Workflow_M"
//                       >
//                         <Input placeholder="Creation Workflow (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Model Number (M)" name="Model_Number_M">
//                         <Input placeholder="Model Number (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Article Number (A)"
//                         name="Article_Number_A"
//                       >
//                         <Input placeholder="Article Number (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Model Name Short (M)"
//                         name="Model_Name_Short_M"
//                       >
//                         <Input placeholder="Model Name Short (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Sports Category (M)"
//                         name="Sports_Category_M"
//                       >
//                         <Input placeholder="Sports Category (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Development Type (A)"
//                         name="Development_Type_A"
//                       >
//                         <Input placeholder="Development Type (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Group Name (A)" name="Group_Name_A">
//                         <Input placeholder="Group Name (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Development Factory (M)"
//                         name="Development_Factory_M"
//                       >
//                         <Input placeholder="Development Factory (M)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Digital Scope (A)"
//                         name="Digital_Scope_A"
//                       >
//                         <Input placeholder="Digital Scope (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Digital Scope Update Date (A)"
//                         name="Digital_Scope_Update_Date_A"
//                       >
//                         <Input placeholder="Digital Scope Update Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Marketing Department (A)"
//                         name="Marketing_Department_A"
//                       >
//                         <Input placeholder="Marketing Department (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Preview Final Rendering Downstream Date (A)"
//                         name="Preview_Final_Rendering_available_Downstream_Date_A"
//                       >
//                         <Input placeholder="Preview Final Rendering Downstream Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Pre-sell Final Rendering Downstream Date (A)"
//                         name="Presell_Final_Rendering_available_Downstream_Date_A"
//                       >
//                         <Input placeholder="Pre-sell Final Rendering Downstream Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="SMS Final Rendering Downstream Date (A)"
//                         name="SMS_Final_Rendering_available_Downstream_Date_A"
//                       >
//                         <Input placeholder="SMS Final Rendering Downstream Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="MCS Final Rendering Downstream Date (A)"
//                         name="MCS_Final_rendering_available_Downstream_Date_A"
//                       >
//                         <Input placeholder="MCS Final Rendering Downstream Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Article Status (A)"
//                         name="Article_Status_A"
//                       >
//                         <Input placeholder="Article Status (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Carry Over Season (A)"
//                         name="Carry_Over_Season_A"
//                       >
//                         <Input placeholder="Carry Over Season (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Consumer Testing (A)"
//                         name="Consumer_Testing_A"
//                       >
//                         <Input placeholder="Consumer Testing (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Image Launch Date (A)"
//                         name="Image_Launch_Date_A"
//                       >
//                         <Input placeholder="Image Launch Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Developer (A)" name="Developer_A">
//                         <Input placeholder="Developer (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Senior Developer (A)"
//                         name="Senior_Developer_A"
//                       >
//                         <Input placeholder="Senior Developer (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Drop Date (A)" name="Drop_Date_A">
//                         <Input placeholder="Drop Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="3D Factory (A)" name="Factory_3D_A">
//                         <Input placeholder="3D Factory (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Tags (A)" name="Tags_A">
//                         <Input placeholder="Tags (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Preview Approval/Publish Date (A)"
//                         name="Preview_Approval_Publish_Date_A"
//                       >
//                         <Input placeholder="Preview Approval/Publish Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Pre-sell Approval/Publish Date (A)"
//                         name="Presell_Approval_Publish_Date_A"
//                       >
//                         <Input placeholder="Pre-sell Approval/Publish Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="SMS Approval/Publish Date (A)"
//                         name="SMS_Approval_Publish_Date_A"
//                       >
//                         <Input placeholder="SMS Approval/Publish Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="MCS Approval/Publish Date (A)"
//                         name="MCS_Approval_Publish_Date_A"
//                       >
//                         <Input placeholder="MCS Approval/Publish Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Published by (A)" name="Published_by_A">
//                         <Input placeholder="Published by (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Published Milestone Timestamp (A)"
//                         name="Published_Milestone_Timestamp_A"
//                       >
//                         <Input placeholder="Published Milestone Timestamp (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Published Milestone (A)"
//                         name="Published_Milestone_A"
//                       >
//                         <Input placeholder="Published Milestone (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Expected Milestone (A)"
//                         name="Expected_Milestone_A"
//                       >
//                         <Input placeholder="Expected Milestone (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="HQ Render Status Timestamp (A)"
//                         name="HQ_Render_Status_Timestamp_A"
//                       >
//                         <Input placeholder="HQ Render Status Timestamp (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="HQ Render Status (A)"
//                         name="HQ_Render_Status_A"
//                       >
//                         <Input placeholder="HQ Render Status (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Design Sketch Latest Update (A)"
//                         name="Design_Sketch_Latest_Update_A"
//                       >
//                         <Input placeholder="Design Sketch Latest Update (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Feasibility Checked Date (A)"
//                         name="Feasibility_Checked_Date_A"
//                       >
//                         <Input placeholder="Feasibility Checked Date (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item
//                         label="Image Confidential (A)"
//                         name="Image_Confidential_A"
//                       >
//                         <Input placeholder="Image Confidential (A)" />
//                       </Form.Item>
//                     </Col>

//                     <Col xs={24} sm={12} lg={6}>
//                       <Form.Item label="Last (M)" name="Last_M">
//                         <Input placeholder="Last (M)" />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//         {/* end scrollable body */}

//         {/* ================================================================
//             STICKY FOOTER
//             ================================================================ */}
//         <div
//           style={{
//             borderTop: "1px solid #f0f0f0",
//             padding: "12px 24px",
//             textAlign: "right",
//             flexShrink: 0,
//             background: "#fff",
//           }}
//         >
//           <Button
//             className="cancel-modal-btn"
//             onClick={handleClose}
//             disabled={loading}
//             style={{ background: "#8c8c8c", color: "#fff", marginRight: 8 }}
//           >
//             Close
//           </Button>

//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             loading={loading}
//             disabled={mode === "create" && isFormEmpty}
//             style={{ background: "#1f1f1f", borderColor: "#1f1f1f" }}
//             className="save-modal-btn"
//           >
//             {loading ? "Saving" : "Save"}
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

import { Button, Col, Form, Grid, Input, Modal, Row, Tag, Tooltip } from "antd";
import { FileBox, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
import type { LastLibraryModalProps, SizeEntry } from "../../types/lastLibrary";
import { stripExt, uid } from "../../lib/helpers";

interface SizeRow {
  id: string;
  file: File | null;
  sizeName: string;
  modelsRaw: string;
  articlesRaw: string;
  localUrl: string; // object URL for preview / table display
  localFileName: string; // original file name
}

function splitCsv(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function makeDefaultSizeRow(): SizeRow {
  return {
    id: uid(),
    file: null,
    sizeName: "",
    modelsRaw: "",
    articlesRaw: "",
    localUrl: "",
    localFileName: "",
  };
}

function SizeCard({
  sizeRow,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  sizeRow: SizeRow;
  index: number;
  onChange: (updated: SizeRow) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (sizeRow.localUrl) URL.revokeObjectURL(sizeRow.localUrl);
    const localUrl = file ? URL.createObjectURL(file) : "";
    const localFileName = file ? file.name : "";
    onChange({
      ...sizeRow,
      file,
      sizeName: file ? stripExt(file.name) : "",
      localUrl,
      localFileName,
    });
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    if (sizeRow.localUrl) URL.revokeObjectURL(sizeRow.localUrl);
    onChange({
      ...sizeRow,
      file: null,
      sizeName: "",
      localUrl: "",
      localFileName: "",
    });
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "10px 14px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            minWidth: 52,
            flexShrink: 0,
          }}
        >
          Size {index + 1}
        </span>

        {sizeRow.file ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "3px 10px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <FileBox size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: 13,
                color: "#1d4ed8",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {sizeRow.file.name}
            </span>
            <Tag
              color="blue"
              style={{ margin: "0 0 0 auto", flexShrink: 0, fontWeight: 600 }}
            >
              {sizeRow.sizeName}
            </Tag>
            <Tooltip title="Remove file">
              <Button
                size="small"
                type="text"
                danger
                icon={<X size={12} />}
                onClick={handleRemoveFile}
                style={{ flexShrink: 0 }}
              />
            </Tooltip>
          </div>
        ) : (
          <Button
            size="small"
            className="btn-custom"
            icon={<Upload size={13} />}
            onClick={() => fileInputRef.current?.click()}
            style={{ fontSize: 12 }}
          >
            Upload .3DM file
          </Button>
        )}

        {canRemove && (
          <Tooltip title="Remove size">
            <Button
              size="small"
              className="delete-btn"
              icon={<Trash2 size={13} />}
              onClick={onRemove}
              style={{ marginLeft: "auto", flexShrink: 0 }}
            />
          </Tooltip>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".3dm"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Ref Models
          </div>
          <Input
            size="small"
            placeholder="e.g. MDL-A001, MDL-A002"
            value={sizeRow.modelsRaw}
            onChange={(e) =>
              onChange({ ...sizeRow, modelsRaw: e.target.value })
            }
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Ref Articles
          </div>
          <Input
            size="small"
            placeholder="e.g. ART-001, ART-002"
            value={sizeRow.articlesRaw}
            onChange={(e) =>
              onChange({ ...sizeRow, articlesRaw: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function LastLibraryModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
  onSizeFileChange,
}: LastLibraryModalProps & {
  onSizeFileChange?: (sizeKey: string, url: string, fileName: string) => void;
}) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([makeDefaultSizeRow()]);

  const formValues = Form.useWatch([], form);
  const isFormEmpty =
    mode === "create" &&
    (!formValues ||
      Object.values(formValues).every(
        (v) => v === undefined || v === null || v === "",
      )) &&
    sizeRows.every((s) => !s.file && !s.modelsRaw && !s.articlesRaw);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      form.setFieldsValue({ ...initialValues });

      if (initialValues.Sizes?.length) {
        setSizeRows(
          initialValues.Sizes.map((s: SizeEntry) => ({
            id: uid(),
            file: null,
            sizeName: s.size,
            modelsRaw: s.refModels.map((r) => r.model).join(", "),
            articlesRaw: s.refModels.flatMap((r) => r.articles).join(", "),
            localUrl: "",
            localFileName: "",
          })),
        );
      } else {
        setSizeRows([makeDefaultSizeRow()]);
      }
    } else {
      form.resetFields();
      setSizeRows([makeDefaultSizeRow()]);
    }
  }, [open, mode, initialValues, form]);

  const addSizeRow = () =>
    setSizeRows((prev) => [...prev, makeDefaultSizeRow()]);

  const updateSizeRow = (id: string, updated: SizeRow) => {
    setSizeRows((prev) => prev.map((s) => (s.id === id ? updated : s)));
    // Notify parent when a file is attached/removed so table can update
    if (onSizeFileChange && updated.sizeName) {
      const sizeKey = `__modal__${updated.id}`;
      onSizeFileChange(sizeKey, updated.localUrl, updated.localFileName);
    }
  };

  const removeSizeRow = (id: string) => {
    setSizeRows((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const models = (raw: string) => splitCsv(raw);
      const articles = (raw: string) => splitCsv(raw);

      const Sizes: SizeEntry[] = sizeRows.map((s) => {
        const modelList = models(s.modelsRaw);
        const articleList = articles(s.articlesRaw);
        return {
          size: s.sizeName || s.file?.name || "",
          SizeFileName: s.localFileName || undefined,
          SizeFilePath: s.localUrl || undefined,
          file: s.file ?? undefined,
          refModels: modelList.length
            ? modelList.map((model) => ({ model, articles: articleList }))
            : [{ model: "", articles: articleList }],
        };
      });

      setLoading(true);
      await onSubmit({ ...values, Sizes });
      console.log({ ...values, Sizes });
    } catch (error) {
      console.log(error);
      AppAlert({ icon: "error", title: "Please fill all fields" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    form.resetFields();
    // Revoke all object URLs before resetting
    sizeRows.forEach((s) => {
      if (s.localUrl) URL.revokeObjectURL(s.localUrl);
    });
    setSizeRows([makeDefaultSizeRow()]);
    onCancel();
  };

  return (
    <Modal
      title={mode === "create" ? "New Item" : "Edit Item"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={isMobile ? "100%" : isTablet ? 900 : 1200}
      style={{ top: isMobile ? 0 : 20, padding: 0 }}
      styles={{
        body: {
          padding: 0,
          height: "calc(90vh - 55px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
      centered={!isMobile}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px 10px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Sizes &amp; Ref Models
          </span>
          <Button
            size="small"
            className="add-btn"
            icon={<Plus size={13} />}
            onClick={addSizeRow}
          >
            Add Size
          </Button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "16px 24px",
          }}
        >
          {/* Size cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {sizeRows.map((sr, idx) => (
              <SizeCard
                key={sr.id}
                sizeRow={sr}
                index={idx}
                onChange={(updated) => updateSizeRow(sr.id, updated)}
                onRemove={() => removeSizeRow(sr.id)}
                canRemove={sizeRows.length > 1}
              />
            ))}
          </div>

          <div style={{ borderTop: "1px dashed #e5e7eb", marginBottom: 16 }} />
          <Form form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={24}>
                <div style={{ width: "100%" }}>
                  <Row gutter={[24, 1]}>
                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Season (M)" name="Season_M">
                        <Input placeholder="Season (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Last (M)" name="Last_M">
                        <Input placeholder="Last (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Creation Workflow (M)"
                        name="Creation_Workflow_M"
                      >
                        <Input placeholder="Creation Workflow (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Model Number (M)" name="Model_Number_M">
                        <Input placeholder="Model Number (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Article Number (A)"
                        name="Article_Number_A"
                      >
                        <Input placeholder="Article Number (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Model Name Short (M)"
                        name="Model_Name_Short_M"
                      >
                        <Input placeholder="Model Name Short (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Sports Category (M)"
                        name="Sports_Category_M"
                      >
                        <Input placeholder="Sports Category (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Development Type (A)"
                        name="Development_Type_A"
                      >
                        <Input placeholder="Development Type (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Group Name (A)" name="Group_Name_A">
                        <Input placeholder="Group Name (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Development Factory (M)"
                        name="Development_Factory_M"
                      >
                        <Input placeholder="Development Factory (M)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Digital Scope (A)"
                        name="Digital_Scope_A"
                      >
                        <Input placeholder="Digital Scope (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Digital Scope Update Date (A)"
                        name="Digital_Scope_Update_Date_A"
                      >
                        <Input placeholder="Digital Scope Update Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Marketing Department (A)"
                        name="Marketing_Department_A"
                      >
                        <Input placeholder="Marketing Department (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Preview Final Rendering Downstream Date (A)"
                        name="Preview_Final_Rendering_available_Downstream_Date_A"
                      >
                        <Input placeholder="Preview Final Rendering Downstream Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Pre-sell Final Rendering Downstream Date (A)"
                        name="Presell_Final_Rendering_available_Downstream_Date_A"
                      >
                        <Input placeholder="Pre-sell Final Rendering Downstream Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="SMS Final Rendering Downstream Date (A)"
                        name="SMS_Final_Rendering_available_Downstream_Date_A"
                      >
                        <Input placeholder="SMS Final Rendering Downstream Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="MCS Final Rendering Downstream Date (A)"
                        name="MCS_Final_rendering_available_Downstream_Date_A"
                      >
                        <Input placeholder="MCS Final Rendering Downstream Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Article Status (A)"
                        name="Article_Status_A"
                      >
                        <Input placeholder="Article Status (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Carry Over Season (A)"
                        name="Carry_Over_Season_A"
                      >
                        <Input placeholder="Carry Over Season (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Consumer Testing (A)"
                        name="Consumer_Testing_A"
                      >
                        <Input placeholder="Consumer Testing (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Image Launch Date (A)"
                        name="Image_Launch_Date_A"
                      >
                        <Input placeholder="Image Launch Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Developer (A)" name="Developer_A">
                        <Input placeholder="Developer (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Senior Developer (A)"
                        name="Senior_Developer_A"
                      >
                        <Input placeholder="Senior Developer (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Drop Date (A)" name="Drop_Date_A">
                        <Input placeholder="Drop Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="3D Factory (A)" name="Factory_3D_A">
                        <Input placeholder="3D Factory (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Tags (A)" name="Tags_A">
                        <Input placeholder="Tags (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Preview Approval/Publish Date (A)"
                        name="Preview_Approval_Publish_Date_A"
                      >
                        <Input placeholder="Preview Approval/Publish Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Pre-sell Approval/Publish Date (A)"
                        name="Presell_Approval_Publish_Date_A"
                      >
                        <Input placeholder="Pre-sell Approval/Publish Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="SMS Approval/Publish Date (A)"
                        name="SMS_Approval_Publish_Date_A"
                      >
                        <Input placeholder="SMS Approval/Publish Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="MCS Approval/Publish Date (A)"
                        name="MCS_Approval_Publish_Date_A"
                      >
                        <Input placeholder="MCS Approval/Publish Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item label="Published by (A)" name="Published_by_A">
                        <Input placeholder="Published by (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Published Milestone Timestamp (A)"
                        name="Published_Milestone_Timestamp_A"
                      >
                        <Input placeholder="Published Milestone Timestamp (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Published Milestone (A)"
                        name="Published_Milestone_A"
                      >
                        <Input placeholder="Published Milestone (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Expected Milestone (A)"
                        name="Expected_Milestone_A"
                      >
                        <Input placeholder="Expected Milestone (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="HQ Render Status Timestamp (A)"
                        name="HQ_Render_Status_Timestamp_A"
                      >
                        <Input placeholder="HQ Render Status Timestamp (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="HQ Render Status (A)"
                        name="HQ_Render_Status_A"
                      >
                        <Input placeholder="HQ Render Status (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Design Sketch Latest Update (A)"
                        name="Design_Sketch_Latest_Update_A"
                      >
                        <Input placeholder="Design Sketch Latest Update (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Feasibility Checked Date (A)"
                        name="Feasibility_Checked_Date_A"
                      >
                        <Input placeholder="Feasibility Checked Date (A)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Form.Item
                        label="Image Confidential (A)"
                        name="Image_Confidential_A"
                      >
                        <Input placeholder="Image Confidential (A)" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: "12px 24px",
            textAlign: "right",
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <Button
            className="cancel-modal-btn"
            onClick={handleClose}
            disabled={loading}
            style={{ background: "#8c8c8c", color: "#fff", marginRight: 8 }}
          >
            Close
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={mode === "create" && isFormEmpty}
            style={{ background: "#1f1f1f", borderColor: "#1f1f1f" }}
            className="save-modal-btn"
          >
            {loading ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
