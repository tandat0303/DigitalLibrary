import Swal from "sweetalert2";

export const SwalLoading = (title = "Processing...") => {
  Swal.fire({
    title,
    // timer: 1000,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
