// import { SwatchBook, Spool, BookCopy, TrendingUp } from "lucide-react";

// export const buttons = [
//   { icon: SwatchBook, label: "COLORS", path: "/colors" },
//   { icon: Spool, label: "MATERIALS", path: "/materials" },
//   { icon: TrendingUp, label: "HIGH ABRASION", path: "/high-abrasion" },
//   { icon: BookCopy, label: "NEW LIBRARY", path: "/new-library" },
// ];
import Colors from "../../assets/colors.png";
import Materials from "../../assets/materials.png";
import HighAbrasion from "../../assets/high-abrasion.png";
import NewLibrary from "../../assets/new-library.png";
import LastLibrary from "../../assets/last-library.png";

export const buttons = [
  {
    image: Colors,
    label: "COLORS",
    path: "/colors",
    menuNameEN: "COLORS",
    hiddenForVendor: true,
  },
  {
    image: Materials,
    label: "MATERIALS",
    path: "/materials",
    menuNameEN: "MATERIALS",
    hiddenForVendor: false,
  },
  {
    image: HighAbrasion,
    label: "HIGH ABRASION",
    path: "/high-abrasion",
    menuNameEN: "HIGH ABRASION",
    hiddenForVendor: true,
  },
  {
    image: NewLibrary,
    label: "NEW LIBRARY",
    path: "/new-library",
    menuNameEN: "NEW LIBRARY",
    hiddenForVendor: true,
  },
  {
    image: LastLibrary,
    label: "LAST LIBRARY",
    path: "/last-library",
    menuNameEN: "LAST LIBRARY",
    hiddenForVendor: true,
  },
];

export const vendorHiddenPaths = buttons
  .filter((b) => b.hiddenForVendor)
  .map((b) => b.path);
