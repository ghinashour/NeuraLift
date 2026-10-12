import API from './axios';

export const sendToAssistant = async (messages) => {
  const resp = await API.post('/assistant', { messages });
  return resp.data;
};
