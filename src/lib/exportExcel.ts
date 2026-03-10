// import * as XLSX from "xlsx-js-style/dist/xlsx.bundle.js";
// import * as XLSX from "xlsx-js-style";
// import saveAs from "file-saver";

// export function exportToExcel<T extends object>(
//   data: T[],
//   headers: string[],
//   fileName: string,
// ) {
//   if (!data.length) return;

//   const sheetData = [
//     headers,
//     ...data.map((row) => headers.map((h) => (row as any)[h] ?? "")),
//   ];

//   const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//   const range = XLSX.utils.decode_range(worksheet["!ref"]!);

//   for (let R = range.s.r; R <= range.e.r; ++R) {
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });

//       if (!worksheet[cellRef]) continue;

//       worksheet[cellRef].s = {
//         alignment: {
//           vertical: "center",
//           horizontal: "center",
//           wrapText: true,
//         },
//         border: {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         },
//         font:
//           R === 0
//             ? {
//                 bold: true,
//               }
//             : {},
//         fill:
//           R === 0
//             ? {
//                 patternType: "solid",
//                 fgColor: { rgb: "c0c0c0" },
//               }
//             : undefined,
//       };
//     }
//   }

//   worksheet["!cols"] = headers.map((header, i) => {
//     const maxLength = Math.max(
//       header.length,
//       ...data.map((row) => String((row as any)[header] ?? "").length),
//     );

//     return { wch: Math.min(maxLength + 5, 40) };
//   });

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Materials");

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const blob = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   saveAs(blob, `${fileName}.xlsx`);
// }
