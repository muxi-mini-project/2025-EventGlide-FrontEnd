import post from '../api/post';
const preUrl = '/interaction/';

const handleInteraction = async (
  url: string,
  data: { studentid: string; subject: string; targetid: string }
) => {
  const res = await post(`${preUrl}${url}`, data);
  return res;
};

export default handleInteraction;
