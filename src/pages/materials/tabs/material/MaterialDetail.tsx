import { Row, Col, Divider, Card, Grid } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { resolveImageSrc, THUMBNAIL_COUNT } from "../../../../lib/helpers";
import NotFound from "../../../NotFound";
export default function MaterialDetailPage() {
  const { unique_price_id } = useParams();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const imageRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState({
    visible: false,
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
  });

  const material = useMemo(() => {
    if (!unique_price_id) return null;

    const saved = sessionStorage.getItem(`material-${unique_price_id}`);

    return saved ? JSON.parse(saved) : null;
  }, [unique_price_id]);

  const images = useMemo(() => {
    if (!material?.Images) return [];
    return material.Images;
  }, [material]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  useEffect(() => {
    return () => {
      if (unique_price_id) {
        sessionStorage.removeItem(`material-${unique_price_id}`);
      }
    };
  }, [unique_price_id]);

  const thumbnails = useMemo(() => {
    return Array.from({ length: THUMBNAIL_COUNT }, (_, i) => images[i] ?? null);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    setZoom({
      visible: true,
      x,
      y,
      bgX: percentX * 100,
      bgY: percentY * 100,
    });
  };

  if (!material) {
    return <NotFound />;
  }

  return (
    <div
      style={{
        height: isMobile ? "auto" : "calc(100vh - 50px)",
        paddingTop: 20,
      }}
    >
      <Card
        title="GENERAL"
        styles={{
          body: {
            flex: isMobile ? undefined : 1,
            overflow: isMobile ? "visible" : "hidden",
            display: isMobile ? "block" : "flex",
          },
        }}
        style={{
          height: isMobile ? "auto" : "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Row
          gutter={[32, 24]}
          style={{
            height: "100%",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <Col
            xs={24}
            md={7}
            style={{
              overflow: "hidden",
            }}
          >
            <div className="flex flex-col h-full gap-4">
              <div
                ref={imageRef}
                onMouseEnter={
                  !isMobile
                    ? () => setZoom((z) => ({ ...z, visible: true }))
                    : undefined
                }
                onMouseLeave={
                  !isMobile
                    ? () => setZoom((z) => ({ ...z, visible: false }))
                    : undefined
                }
                onMouseMove={!isMobile ? handleMouseMove : undefined}
                style={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? 260 : 400,
                  border: "1px solid #ddd",
                  background: "#808080",
                  overflow: "hidden",
                }}
              >
                {images[selectedIndex] ? (
                  <img
                    ref={imageRef}
                    src={resolveImageSrc(images[selectedIndex])}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#fff",
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Image
                  </span>
                )}

                {!isMobile && zoom.visible && images[selectedIndex] && (
                  <div
                    style={{
                      position: "absolute",
                      width: 200,
                      height: 200,
                      left: zoom.x - 100,
                      top: zoom.y - 100,
                      border: "2px solid white",
                      boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                      pointerEvents: "none",

                      backgroundImage: `url(${images[selectedIndex]})`,
                      backgroundRepeat: "no-repeat",

                      backgroundSize: "200%", // zoom level
                      backgroundPosition: `${zoom.bgX}% ${zoom.bgY}%`,
                      transition: "background-position 0.03s linear",
                    }}
                  />
                )}
              </div>

              <div
                className="flex gap-2"
                style={{
                  overflowX: isMobile ? "auto" : "visible",
                  justifyContent: "center",
                  paddingBottom: 4,
                }}
              >
                {thumbnails.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    style={{
                      width: isMobile ? 64 : 80,
                      height: isMobile ? 64 : 80,
                      flexShrink: 0,
                      border:
                        selectedIndex === index
                          ? "2px solid #1677ff"
                          : "1px solid #ddd",
                      background: "#808080",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {img ? (
                      <img
                        src={resolveImageSrc(img)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: "#fff",
                          position: "absolute",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        No Image
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col
            xs={24}
            md={17}
            style={{
              height: isMobile ? "calc(100vh - 530px)" : "100%",
              overflowY: "auto",
              // paddingRight: isMobile ? 0 : 8,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <strong>Material Id</strong>
                <div>
                  {material.Material_ID ? material.Material_ID : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Vendor Code</strong>
                <div>
                  {material.Vendor_Code ? material.Vendor_Code : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier</strong>
                <div>{material.Supplier ? material.Supplier : "No data"}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier Material Id</strong>
                <div>
                  {material.Supplier_Material_ID
                    ? material.Supplier_Material_ID
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier Material Name</strong>
                <div>
                  {material.Supplier_Material_Name
                    ? material.Supplier_Material_Name
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Mtl_Supp Lifecycle State</strong>
                <div>
                  {material.Mtl_Supp_Lifecycle_State
                    ? material.Mtl_Supp_Lifecycle_State
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Type Level 1</strong>
                <div>
                  {material.Material_Type_Level_1
                    ? material.Material_Type_Level_1
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Composition</strong>
                <div>
                  {material.Composition ? material.Composition : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Classification</strong>
                <div>
                  {material.Classification
                    ? material.Classification
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Thickness</strong>
                <div>
                  {material.Material_Thickness
                    ? material.Material_Thickness
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Thickness UOM</strong>
                <div>
                  {material.Material_Thickness_UOM
                    ? material.Material_Thickness_UOM
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Comparison UOM</strong>
                <div>
                  {material.Comparison_UOM
                    ? material.Comparison_UOM
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Price Remark</strong>
                <div>
                  {material.Price_Remark ? material.Price_Remark : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Skin Size</strong>
                <div>{material.Skin_Size ? material.Skin_Size : "No data"}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>QC Percent</strong>
                <div>
                  {material.QC_Percent ? material.QC_Percent : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Leadtime</strong>
                <div>{material.Leadtime ? material.Leadtime : "No data"}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Sample Leadtime</strong>
                <div>
                  {material.Sample_Leadtime
                    ? material.Sample_Leadtime
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Min Qty Color</strong>
                <div>
                  {material.Min_Qty_Color ? material.Min_Qty_Color : "No data"}
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <strong>Min Qty Sample</strong>
                <div>
                  {material.Min_Qty_Sample
                    ? material.Min_Qty_Sample
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Production Location</strong>
                <div>
                  {material.Production_Location
                    ? material.Production_Location
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Terms of Delivery per T1 Country</strong>
                <div>
                  {material.Terms_of_Delivery_per_T1_Country
                    ? material.Terms_of_Delivery_per_T1_Country
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Valid From Price</strong>
                <div>
                  {material.Valid_From_Price
                    ? material.Valid_From_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Valid To Price</strong>
                <div>
                  {material.Valid_To_Price
                    ? material.Valid_From_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Price Type</strong>
                <div>
                  {material.Price_Type ? material.Price_Type : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Color Code Price</strong>
                <div>
                  {material.Color_Code_Price
                    ? material.Color_Code_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Color Price</strong>
                <div>
                  {material.Color_Price ? material.Color_Price : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Treatment Price</strong>
                <div>
                  {material.Treatment_Price
                    ? material.Treatment_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Width Price</strong>
                <div>
                  {material.Width_Price ? material.Width_Price : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Width Uom Price</strong>
                <div>
                  {material.Weight_Uom_Price
                    ? material.Width_Uom_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Length Price</strong>
                <div>
                  {material.Length_Price ? material.Length_Price : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Length Uom Price</strong>
                <div>
                  {material.Material_Thickness
                    ? material.Material_Thickness
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Thickness Price</strong>
                <div>
                  {material.Thickness_Price
                    ? material.Thickness_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Thickness Uom Price</strong>
                <div>
                  {material.Thickness_Uom_Price
                    ? material.Thickness_Uom_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Diameter Inside Price</strong>
                <div>
                  {material.Diameter_Inside_Price
                    ? material.Diameter_Inside_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Diameter Inside Uom Price</strong>
                <div>
                  {material.Diameter_Inside_Uom_Price
                    ? material.Diameter_Inside_Uom_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Weight Price</strong>
                <div>
                  {material.Weight_Price ? material.Weight_Price : "No data"}
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <strong>Weight Uom Price</strong>
                <div>
                  {material.Weight_Uom_Price
                    ? material.Weight_Uom_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Quantity Price</strong>
                <div>
                  {material.Quantity_Price
                    ? material.Quantity_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Quantity Uom Price</strong>
                <div>
                  {material.Quantity_Uom_Price
                    ? material.Quantity_Uom_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Uom String Price</strong>
                <div>
                  {material.Uom_String_Price
                    ? material.Uom_String_Price
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>SS26 Final Price USD</strong>
                <div>
                  {material.SS26_Final_Price_USD
                    ? material.SS26_Final_Price_USD
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Comparison Price Price USD</strong>
                <div>
                  {material.Comparison_Price_Price_USD
                    ? material.Comparison_Price_Price_USD
                    : "No data"}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Approved As Final Price Y/N Price</strong>
                <div>
                  {material.Approved_As_Final_Price_Y_N_Price
                    ? material.Approved_As_Final_Price_Y_N_Price
                    : "No data"}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
