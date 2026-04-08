import { Row, Col, Divider, Card, Grid } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  displayValue,
  resolveImageSrc,
  sortImagesByType,
  THUMBNAIL_COUNT,
} from "../../../../lib/helpers";
import NotFound from "../../../NotFound";
import type { MaterialsDataType } from "../../../../types/materials";
import materialApi from "../../../../api/materials.api";
import { AppAlert } from "../../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../../lib/getApiErrorMsg";
import Loading from "../../../../components/ui/Loading";

const ZOOM_SCALE = 3;

export default function MaterialDetail() {
  const [material, setMaterial] = useState<MaterialsDataType>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const imageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const zoomActive = useRef(false);
  const zoomOrigin = useRef({ ox: 50, oy: 50 });

  const touchZoomActive = useRef(false);
  const [touchZoomVisible, setTouchZoomVisible] = useState(false);
  const lastTapTime = useRef(0);
  const DOUBLE_TAP_DELAY = 300;

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await materialApi.getDetailMaterial(id);
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

  useEffect(() => {
    zoomActive.current = false;
    touchZoomActive.current = false;
    setTouchZoomVisible(false);
    zoomOrigin.current = { ox: 50, oy: 50 };
    applyZoom(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [selectedIndex]);

  const thumbnails = useMemo(() => {
    return Array.from({ length: THUMBNAIL_COUNT }, (_, i) => images[i] ?? null);
  }, [images]);

  const applyZoom = (active: boolean) => {
    const img = imgRef.current;
    if (!img) return;
    if (active) {
      img.style.transform = `scale(${ZOOM_SCALE})`;
      img.style.transformOrigin = `${zoomOrigin.current.ox}% ${zoomOrigin.current.oy}%`;
    } else {
      img.style.transform = "scale(1)";
      img.style.transformOrigin = "center center";
    }
  };

  const computeOrigin = (clientX: number, clientY: number, rect: DOMRect) => {
    const ox = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    const oy = Math.max(
      0,
      Math.min(100, ((clientY - rect.top) / rect.height) * 100),
    );
    return { ox, oy };
  };

  const scheduleApply = (active: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      applyZoom(active);
      rafRef.current = null;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isMobile || !images[selectedIndex]) return;
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { ox, oy } = computeOrigin(e.clientX, e.clientY, rect);
    zoomOrigin.current = { ox, oy };
    zoomActive.current = true;
    scheduleApply(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !zoomActive.current) return;
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { ox, oy } = computeOrigin(e.clientX, e.clientY, rect);
    zoomOrigin.current = { ox, oy };
    scheduleApply(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    zoomActive.current = false;
    scheduleApply(false);
  };

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (!images[selectedIndex] || e.touches.length !== 1) return;

      const now = Date.now();
      const isDoubleTap = now - lastTapTime.current < DOUBLE_TAP_DELAY;
      lastTapTime.current = now;

      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const { ox, oy } = computeOrigin(touch.clientX, touch.clientY, rect);

      if (touchZoomActive.current) {
        if (isDoubleTap) {
          touchZoomActive.current = false;
          setTouchZoomVisible(false);
          zoomOrigin.current = { ox: 50, oy: 50 };
          applyZoom(false);
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        } else {
          zoomOrigin.current = { ox, oy };
          applyZoom(true);
        }
      } else {
        touchZoomActive.current = true;
        setTouchZoomVisible(true);
        zoomOrigin.current = { ox, oy };
        applyZoom(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchZoomActive.current || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const { ox, oy } = computeOrigin(touch.clientX, touch.clientY, rect);
      zoomOrigin.current = { ox, oy };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        applyZoom(true);
        rafRef.current = null;
      });
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images, selectedIndex]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? 260 : 400,
                  border: "1px solid #ddd",
                  background: "#808080",
                  overflow: "hidden",
                  cursor: images[selectedIndex]
                    ? isMobile
                      ? "pointer"
                      : "zoom-in"
                    : undefined,
                }}
              >
                {images[selectedIndex] ? (
                  <img
                    ref={imgRef}
                    src={resolveImageSrc(images[selectedIndex])}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                    style={{
                      transition: "transform 0.08s ease-out",
                      transformOrigin: "center center",
                      imageRendering: "auto",
                    }}
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

                {/* Mobile: tap-to-zoom hint */}
                {isMobile && images[selectedIndex] && !touchZoomVisible && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 12,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    Tap to zoom
                  </div>
                )}

                {/* Mobile: active zoom indicator */}
                {isMobile && images[selectedIndex] && touchZoomVisible && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(22,119,255,0.75)",
                      color: "#fff",
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 12,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    Double-tap to exit
                  </div>
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
