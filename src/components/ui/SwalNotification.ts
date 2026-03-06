import Swal, { type SweetAlertIcon } from "sweetalert2";

export const SwalNotification = (icon: SweetAlertIcon, title: string) => {
  Swal.fire({
    icon,
    title,
    confirmButtonText: "OK",
  });
};
