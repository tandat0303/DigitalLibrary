import { Button, Col, Form, Grid, Input, Modal, Row, Tooltip } from "antd";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
import type { LastLibraryModalProps } from "../../types/lastLibrary";
import { getDuplicates, normalizeArticles, uid } from "../../lib/helpers";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface SizeRow {
  id: string;
  sizeId?: string;
  sizeName: string;
  refModels: RefModelRowItem[];
}

interface ArticleItem {
  articleId?: string;
  article: string;
}

interface RefModelRowItem {
  id: string;
  modelId?: string;
  model: string;
  articles: ArticleItem[];
  articleInput: string;
}

function makeDefaultSizeRow(): SizeRow {
  return {
    id: uid(),
    sizeName: "",
    refModels: [makeDefaultRefModelRow()],
  };
}

function makeDefaultRefModelRow(): RefModelRowItem {
  return { id: uid(), model: "", articles: [], articleInput: "" };
}

function RefModelRow({
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  item: RefModelRowItem;
  onChange: (updated: RefModelRowItem) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // update nhẹ, không parse ở đây
    onChange({
      ...item,
      articleInput: val,
    });
  };

  const duplicates = getDuplicates(item.articleInput);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "6px 0",
      }}
    >
      <div style={{ width: 160, flexShrink: 0 }}>
        <Input
          size="small"
          placeholder="Ref Model"
          value={item.model}
          onChange={(e) => onChange({ ...item, model: e.target.value })}
        />
      </div>

      <div style={{ flex: 1 }}>
        <Input
          status={duplicates.size ? "error" : ""}
          size="small"
          placeholder="Ref Articles, separated by comma"
          value={item.articleInput}
          onChange={handleArticleChange}
        />

        {duplicates.size > 0 && (
          <div style={{ color: "red", fontSize: 11 }}>
            Duplicate: {Array.from(duplicates).join(", ")}
          </div>
        )}
      </div>

      {canRemove && (
        <Tooltip title="Remove ref model">
          <Button
            size="small"
            danger
            type="text"
            icon={<X size={14} />}
            onClick={onRemove}
          />
        </Tooltip>
      )}
    </div>
  );
}

const RefModelRowMemo = React.memo(RefModelRow, (prev, next) => {
  return prev.item === next.item && prev.canRemove === next.canRemove;
});

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
  const updateRefModel = React.useCallback(
    (refId: string, updated: RefModelRowItem) => {
      onChange({
        ...sizeRow,
        refModels: sizeRow.refModels.map((r) => (r.id === refId ? updated : r)),
      });
    },
    [sizeRow, onChange],
  );

  const removeRefModel = React.useCallback(
    (refId: string) => {
      onChange({
        ...sizeRow,
        refModels: sizeRow.refModels.filter((r) => r.id !== refId),
      });
    },
    [sizeRow, onChange],
  );

  const addRefModel = () => {
    onChange({
      ...sizeRow,
      refModels: [...sizeRow.refModels, makeDefaultRefModelRow()],
    });
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "10px 14px",
        background: "#fafafa",
        position: "relative",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
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
          }}
        >
          Size {index + 1}
        </span>

        <Input
          size="small"
          placeholder="Size (e.g. EU40)"
          value={sizeRow.sizeName}
          onChange={(e) => onChange({ ...sizeRow, sizeName: e.target.value })}
        />

        <Tooltip title={canRemove ? "Remove size" : "Clear size"}>
          <Button
            size="small"
            danger
            type="text"
            icon={<X size={14} />}
            onClick={onRemove}
            style={{ flexShrink: 0 }}
          />
        </Tooltip>
      </div>

      {/* Column headers for ref model section */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 0 4px",
          borderBottom: "1px dashed #e5e7eb",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            width: 160,
            flexShrink: 0,
            fontSize: 11,
            color: "#9ca3af",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Ref Model
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 11,
            color: "#9ca3af",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Ref Articles
        </span>
      </div>

      {/* Ref model rows */}
      {sizeRow.refModels.map((ref) => (
        <RefModelRowMemo
          key={ref.id}
          item={ref}
          onChange={(updated) => updateRefModel(ref.id, updated)}
          onRemove={() => removeRefModel(ref.id)}
          canRemove={sizeRow.refModels.length > 1}
        />
      ))}

      {/* Add ref model */}
      <Button
        size="small"
        type="dashed"
        icon={<Plus size={12} />}
        onClick={addRefModel}
        style={{ marginTop: 6, fontSize: 12 }}
      >
        Add Ref Model
      </Button>
    </div>
  );
}

export default function LastLibraryModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: LastLibraryModalProps) {
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
    sizeRows.every((s) => !s.sizeName && s.refModels.every((r) => !r.model));

  // ---- seed from initialValues on edit ----
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      form.setFieldsValue({ ...initialValues });

      if (initialValues.sizes?.length) {
        setSizeRows(
          initialValues.sizes.map((s: any) => ({
            id: uid(),
            sizeId: s.SizeID,
            sizeName: s.Size,
            refModels: s.models.map((m: any) => ({
              id: uid(),
              modelId: m.ModelID,
              model: m.Model,
              articles: m.articles.map((a: any) => ({
                articleId: a.ArticleID,
                article: a.Article,
              })),
              articleInput: m.articles.map((a: any) => a.Article).join(", "),
            })),
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
  };

  const clearSizeRow = (id: string) => {
    setSizeRows((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              sizeId: undefined,
              sizeName: "",
              refModels: [makeDefaultRefModelRow()],
            }
          : s,
      ),
    );
  };

  const removeSizeRow = (id: string) => {
    setSizeRows((prev) => prev.filter((s) => s.id !== id));
  };

  const confirmRemoveSizeRow = (sr: SizeRow) => {
    if (!sr.id) return;
    const isOnly = sizeRows.length === 1;

    if (mode === "edit") {
      Modal.confirm({
        title: isOnly ? "CLEAR SIZE" : "REMOVE SIZE",
        content: isOnly
          ? "This is the only size. Clear its fields?"
          : "Are you sure to remove this size?",
        okText: "Yes",
        cancelText: "No",
        okType: "danger",
        centered: true,
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
        onOk: () => (isOnly ? clearSizeRow(sr.id) : removeSizeRow(sr.id)),
      });
    } else {
      if (isOnly) {
        clearSizeRow(sr.id);
      } else {
        removeSizeRow(sr.id);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const sizes = sizeRows.map((s) => ({
        ...(s.sizeId ? { sizeId: s.sizeId } : {}),
        size: s.sizeName,
        models: s.refModels.map((r) => {
          const parsed = normalizeArticles(r.articleInput);

          const articles: ArticleItem[] = parsed.map((a, idx) => ({
            articleId: r.articles[idx]?.articleId,
            article: a,
          }));

          return {
            ...(r.modelId ? { modelId: r.modelId } : {}),
            model: r.model,
            articles,
          };
        }),
      }));

      setLoading(true);
      await onSubmit({ ...values, sizes });
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
              maxHeight: 320,
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: 4,
            }}
          >
            {sizeRows.map((sr, idx) => (
              <SizeCard
                key={sr.id}
                sizeRow={sr}
                index={idx}
                onChange={(updated) => updateSizeRow(sr.id, updated)}
                onRemove={() => confirmRemoveSizeRow(sr)}
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
        {/* end scrollable body */}

        {/* ================================================================
            STICKY FOOTER
            ================================================================ */}
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
