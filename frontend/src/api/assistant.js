import axios from './axios';

export const sendToAssistant = async (messages) => {
  const resp = await axios.post('/api/assistant', { messages });
  return resp.data;
};
