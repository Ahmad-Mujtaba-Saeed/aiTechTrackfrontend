import axios from "../../../api/axios";


export const fetchAllPlans = async (page = 1, search = '') => {
  const response = await axios.get(`/admin/billing/plans?page=${page}&search=${search}`); // e.g. /me endpoint
  return response.data;
};