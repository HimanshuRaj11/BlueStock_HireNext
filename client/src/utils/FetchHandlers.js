import axios from "axios";

export const getAllHandler = async (url) => {
    const res = await axios.get(url);
    return res.data;
};

export const getSingleHandler = async (url) => {
    const res = await axios.get(url);
    return res?.data?.result;
};

export const postHandler = async ({ url, body }) => {
    return await axios.post(url, body, { withCredentials: true });
};

export const updateHandler = async ({ url, body }) => {
    const res = await axios.patch(url, body);
    return res?.data?.result;
};

export const updateHandlerPut = async ({ url, body }) => {
    return await axios.put(url, body);
};

export const deleteHandler = async (url) => {
    return await axios.delete(url);
};

export const googleAuthHandler = async (googleData) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
        googleData,
        { withCredentials: true }
    );
    return res?.data;
};
