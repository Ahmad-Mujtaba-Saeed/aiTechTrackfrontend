import axios from "../../api/axios";

export const fetchInterviewUserHistory = async () => {
  const response = await axios.get("/interview/history?limit=6"); // e.g. /me endpoint
  console.log("request hit",response.data);
  return response.data;
};


export const fetchUserInterviewQuestions = async (filters) => {
  console.log("filters" , filters);
    const params = new URLSearchParams();
    if (filters.difficulty) params.append('difficulty_slug', filters.difficulty.slug);
    if (filters.questionType) params.append('questiontype_slug', filters.questionType.slug);
    if (filters.subcategory) params.append('subcategories_slug', filters.subcategory.slug);
    if (filters.searchQuery) params.append('search', filters.searchQuery);
    console.log("params" , params);
    
    const response = await axios.get(`/questions?${params.toString()}`); // e.g. /me endpoint
    return response.data;
};

export const fetchUserInterviewQuestionById = async (id) => {
  console.log("interview", id);
  const response = await axios.get(`/questions/${id}`); // e.g. /me endpoint
// console.log("request hit",response.data);
  return response.data;
};


export const fetchRandomInterviewQuestions = async () => {
  console.log("Fetching random questions");
  const response = await axios.get('/random-questions');
  console.log("Random questions response:", response.data);
  return response.data;
};