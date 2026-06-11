const API_BASE_URL = import.meta.env.VITE_IMG_URL;

export const ASSETS_URLS = {
  avatars: `${API_BASE_URL}/uploads/avatars/`,
  staffAvatars: `${API_BASE_URL}/uploads/staff-avatars/`,
  fileImportPatient: `${API_BASE_URL}/formats/pacientes_importacion.xlsx`,
};