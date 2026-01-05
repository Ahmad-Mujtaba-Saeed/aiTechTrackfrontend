import axios from "../../../api/axios";

export const fetchAllUsers = async (page = 1, search = '') => {
  const response = await axios.get(`/users/management?page=${page}&search=${search}`); // e.g. /me endpoint
  return response.data;
};


export const fetchUserSubscriptionDetails = async (userId) => {
  const response = await axios.get(`/users/management/subscription-status/${userId}`); // e.g. /me endpoint
  return response.data;
};


export const toggleUserActiveStatusApi = async (userId) => {
  const response = await axios.post(`/users/management/toggle-user-enable-disable/${userId}`); // e.g. /me endpoint
  return response.data;
};