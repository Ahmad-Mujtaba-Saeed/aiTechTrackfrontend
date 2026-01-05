import axios from "../../../api/axios";

export const fetchAllSubscriptions = async ({ page = 1, search = '', status = '', per_page = 10 }) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (per_page) params.append('per_page', per_page);
  
  const response = await axios.get(`/billing/subscriptions?${params}`);
  return response.data;
};