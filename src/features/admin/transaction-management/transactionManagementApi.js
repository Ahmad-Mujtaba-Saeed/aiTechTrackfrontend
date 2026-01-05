import axios from "../../../api/axios";


export const fetchAllTransactions = async (page = 1, search = '', payment_status = '') => {
  const response = await axios.get(`/billing/transactions?page=${page}&search=${search}&payment_status=${payment_status}`); // e.g. /me endpoint
  return response.data;
};