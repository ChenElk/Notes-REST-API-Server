import axios from 'axios'

const baseUrl = 'http://127.0.0.1:3001/ai/complete'

let token: string | null = null;

const setToken = (newToken: string | null) => {
  token = newToken ? `Bearer ${newToken}` : null;
};

const complete = ( prompt: string ) => {
    const config = {
        headers: {
        Authorization: token,
        },
    };

  const request = axios.post(baseUrl,  {prompt} , config);
  return request.then(response => response.data);
};

export default {
  setToken,
  complete
};