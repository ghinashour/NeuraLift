// src/utils/alerts.js
import Swal from 'sweetalert2';

export const showSuccess = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,
    timer: 2000,
  });
};

export const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
};

export const showInfo = (message) => {
  Swal.fire({
    icon: 'info',
    title: 'Info',
    text: message,
  });
};

export const showConfirm = async (message) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, continue',
    cancelButtonText: 'Cancel',
  });
  return result.isConfirmed;
};
