import Swal from "sweetalert2";

export const SwalLoading = (title = "Processing...") => {
  Swal.fire({
    title,
    timer: 700,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
