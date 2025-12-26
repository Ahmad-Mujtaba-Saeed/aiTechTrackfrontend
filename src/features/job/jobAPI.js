import axios from "../../api/axios";

export const fetchUserJobs = async (formData) => {
  const response = await axios.get(`/fetch-jobs?q=${encodeURIComponent(
    formData.searchQuery + " " + formData.location + " " + formData.country)}&gl=${formData.country}&location=${encodeURIComponent(formData.location)}&remote=${formData.remote}`); // e.g. /me endpoint
  return response.data;
};

export const UserJobAppliedCreate = async (formData) => {
  const response = await axios.post('/apply-job', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}


export const fetchUserAppliedJobs = async () => {
  const response = await axios.get("/applied-jobs"); // e.g. /me endpoint
  return response.data;
};

export const UserJobAppliedUpdate = async (id, updates) => {
  const response = await axios.put(`/update-applied-app/${id}`, updates, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

export const UserJobAppliedDelete = async (id) => {
  const response = await axios.delete(`/delete-applied-app/${id}`);
  return response.data;
}
