import { post } from '../api/request';
const preUrl = '/interaction/';

const handleInteraction = async (
  url: string,
  data: { studentId: string; subject: string; targetId: string; parentId?: string }
) => {
  console.log(data);
  const res = await post(`${preUrl}${url}`, data);
  return res;
};

export default handleInteraction;
