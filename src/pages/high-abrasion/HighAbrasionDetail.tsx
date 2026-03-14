import { Row, Col, Divider, Card, Grid } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  displayValue,
  resolveImageSrc,
  sortImagesByType,
  THUMBNAIL_COUNT,
} from "../../lib/helpers";
import NotFound from "../NotFound";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import Loading from "../../components/ui/Loading";
import type { HighAbrasionDataType } from "../../types/highAbrasion";
import highAbrasionApi from "../../api/highAbrasion.api";
export default function HighAbrasionDetail() {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [material, setMaterial] = useState<HighAbrasionDataType>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const imageRef = useRef<HTMLDivElement | null>(null);

  const lensRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const zoomData = useRef({
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
    visible: false,
  });

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        if (!id) return;

        setLoading(true);

        const res = await highAbrasionApi.getDetailMaterial(id);

        setMaterial(res);
      } catch (error) {
        AppAlert({
          icon: "error",
          title: getApiErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialDetail();
  }, [id]);

  const images = useMemo(() => {
    if (!material?.Images) return [];

    return sortImagesByType(material.Images);
  }, [material]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const thumbnails = useMemo(() => {
    return Array.from({ length: THUMBNAIL_COUNT }, (_, i) => images[i] ?? null);
  }, [images]);

  const LENS_SIZE = 150;
  const ZOOM_SCALE = 1;

  const updateLens = () => {
    const lens = lensRef.current;
    const data = zoomData.current;

    if (!lens) return;

    lens.style.left = `${data.x - LENS_SIZE / 2}px`;
    lens.style.top = `${data.y - LENS_SIZE / 2}px`;

    lens.style.backgroundPosition = `-${
      data.bgX - LENS_SIZE / 2
    }px -${data.bgY - LENS_SIZE / 2}px`;

    rafRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !lensRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const half = LENS_SIZE / 2;

    x = Math.max(half, Math.min(rect.width - half, x));
    y = Math.max(half, Math.min(rect.height - half, y));

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    zoomData.current = {
      x,
      y,
      bgX: percentX * rect.width * ZOOM_SCALE,
      bgY: percentY * rect.height * ZOOM_SCALE,
      visible: true,
    };

    setImageSize({
      width: rect.width,
      height: rect.height,
    });

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateLens);
    }
  };

  if (loading) {
    return <Loading overlay fullScreen />;
  }

  if (!material) {
    return <NotFound />;
  }

  return (
    <div
      style={{
        height: isMobile ? "auto" : "calc(100vh - 50px)",
        // paddingTop: 20,
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
                onMouseEnter={() => {
                  if (lensRef.current) lensRef.current.style.opacity = "1";
                }}
                onMouseLeave={() => {
                  if (lensRef.current) lensRef.current.style.opacity = "0";
                }}
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

                {!isMobile && images[selectedIndex] && (
                  <div
                    ref={lensRef}
                    style={{
                      position: "absolute",
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      border: "2px solid white",
                      boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                      pointerEvents: "none",

                      opacity: 0,
                      transition: "opacity 0.15s",

                      backgroundImage: `url(${resolveImageSrc(
                        images[selectedIndex],
                      )})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${imageSize.width * ZOOM_SCALE}px ${
                        imageSize.height * ZOOM_SCALE
                      }px`,
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
                <div>{displayValue(material.Material_ID)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Vendor Code</strong>
                <div>{displayValue(material.Vendor_Code)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier</strong>
                <div>{displayValue(material.Supplier)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier Material Id</strong>
                <div>{displayValue(material.Supplier_Material_ID)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Supplier Material Name</strong>
                <div>{displayValue(material.Supplier_Material_Name)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Mtl_Supp Lifecycle State</strong>
                <div>{displayValue(material.Mtl_Supp_Lifecycle_State)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Type Level 1</strong>
                <div>{displayValue(material.Material_Type_Level_1)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Composition</strong>
                <div>{displayValue(material.Composition)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Classification</strong>
                <div>{displayValue(material.Classification)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Thickness</strong>
                <div>{displayValue(material.Material_Thickness)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Material Thickness UOM</strong>
                <div>{displayValue(material.Material_Thickness_UOM)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Comparison UOM</strong>
                <div>{displayValue(material.Comparison_UOM)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Price Remark</strong>
                <div>{displayValue(material.Price_Remark)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Skin Size</strong>
                <div>{displayValue(material.Skin_Size)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>QC Percent</strong>
                <div>{displayValue(material.QC_Percent)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Leadtime</strong>
                <div>{displayValue(material.Leadtime)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Sample Leadtime</strong>
                <div>{displayValue(material.Sample_Leadtime)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Min Qty Color</strong>
                <div>{displayValue(material.Min_Qty_Color)}</div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <strong>Min Qty Sample</strong>
                <div>{displayValue(material.Min_Qty_Sample)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Production Location</strong>
                <div>{displayValue(material.Production_Location)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Terms of Delivery per T1 Country</strong>
                <div>
                  {displayValue(material.Terms_of_Delivery_per_T1_Country)}
                </div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Valid From Price</strong>
                <div>{displayValue(material.Valid_From_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Valid To Price</strong>
                <div>{displayValue(material.Valid_To_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Price Type</strong>
                <div>{displayValue(material.Price_Type)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Color Code Price</strong>
                <div>{displayValue(material.Color_Code_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Color Price</strong>
                <div>{displayValue(material.Color_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Treatment Price</strong>
                <div>{displayValue(material.Treatment_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Width Price</strong>
                <div>{displayValue(material.Width_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Width Uom Price</strong>
                <div>{displayValue(material.Width_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Length Price</strong>
                <div>{displayValue(material.Length_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Length Uom Price</strong>
                <div>{displayValue(material.Length_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Thickness Price</strong>
                <div>{displayValue(material.Thickness_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Thickness Uom Price</strong>
                <div>{displayValue(material.Thickness_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Diameter Inside Price</strong>
                <div>{displayValue(material.Diameter_Inside_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Diameter Inside Uom Price</strong>
                <div>{displayValue(material.Diameter_Inside_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Weight Price</strong>
                <div>{displayValue(material.Weight_Price)}</div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <strong>Weight Uom Price</strong>
                <div>{displayValue(material.Weight_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Quantity Price</strong>
                <div>{displayValue(material.Quantity_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Quantity Uom Price</strong>
                <div>{displayValue(material.Quantity_Uom_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Uom String Price</strong>
                <div>{displayValue(material.Uom_String_Price)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>SS26 Final Price USD</strong>
                <div>{displayValue(material.SS26_Final_Price_USD)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Comparison Price Price USD</strong>
                <div>{displayValue(material.Comparison_Price_Price_USD)}</div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <strong>Approved As Final Price Y/N Price</strong>
                <div>
                  {displayValue(material.Approved_As_Final_Price_Y_N_Price)}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
