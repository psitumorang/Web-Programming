import Axios from 'axios';

const sendUploadPostRequest = async function sendUploadPostRequest(url, body) {
  console.log('in database module about to sendPostrequest, url of ', url, 'body of ', body);
  const res = await Axios.post(url, body);
  console.log(res);
  return res;
};

export default sendUploadPostRequest;
