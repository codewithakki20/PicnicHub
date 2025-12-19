import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/support";

const contactSupport = async (data) => {
    const response = await axios.post(`${API_URL}/contact`, data);
    return response.data;
};

export default {
    contactSupport,
};
