import axios from "../../../api/axios";


export const fetchAllCoreCredentials = async () => {
  const response = await axios.get(`/admin/core-credentials`); // e.g. /me endpoint
  return response.data;
};

export const deleteCoreCredentialApi = async (key) => {
  const response = await axios.delete(`/admin/core-credentials/${key}`); // e.g. /me endpoint
  return response.data;
};

export const updateOrCreateCoreCredentialApi = async (formData) => {
  const response = await axios.post(`/admin/core-credentials`, formData); // e.g. /me endpoint
  return response.data;
};