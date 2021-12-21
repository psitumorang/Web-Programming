import Axios from 'axios';

const sendUploadPostRequest = async function sendUploadPostRequest(url, body) {
  const res = await Axios.post(url, body);
  return res;
};

export default sendUploadPostRequest;
