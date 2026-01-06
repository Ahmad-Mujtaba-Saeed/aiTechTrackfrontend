import axios from "../../api/axios";

export const createEmptyUserResume = async (emptyResume) => {
  const response = await axios.post("/resume/create-empty", { newEmptyResume : emptyResume});
  return response.data;
};


export const fetchUserResumeById = async (id) => {
  const response = await axios.get("/resume/"+id);
  return response.data;
};

export const updateUserResumeById = async ({id , parsedResume}) => {
  const response = await axios.put("/resume/"+id , {cv_resumejson : parsedResume});
  return response.data;
}


export const uploadExistingUserResume = async (formData) => {
  const response = await axios.post("/resume/parse-resume", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (data) => data, // Prevent axios from transforming the FormData
  });
  return response.data;
}

// not used currently

export const generateUserCvAi = async (formData) => {
  const response = await axios.post("/generate-cv-ai", formData);
  return response.data;
}

// not used currently

export const analyzeUserResumeAi = async (formData) => {
  const response = await axios.post("/analyze-paragraph", formData);
  return response.data;
}

// not used currently

export const generateUserCoverLetter = async (formData) =>{
  const response = await axios.post("/generate-cover-letter", formData);
  return response.data;
}

// not used currently

export const recentUserCvsCreated = async ({ page = 1, perPage = 3 }) =>{
  const response = await axios.get("/resume", {
    params: {
      page,
      perPage,
    },
  });
  return response.data;
}

export const delUserCreatedCv = async (id) => {
  const response = await axios.delete('/resume/'+id);
  return response.data;
}

export const updateUserResumeName = async ({id , name}) => {
  const response = await axios.put("/resume/"+id , {title : name});
  return response.data;
}
