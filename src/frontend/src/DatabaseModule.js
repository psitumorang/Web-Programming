const sendPostRequest = async function sendPostRequest(url, body) {
  console.log('in database module about to sendPostrequest, url of ', url, 'body of ', body);
  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => result);

    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR');
    return null;
  }
};

const sendPutRequest = async function sendPutRequest(url, body) {
  try {
    console.log('in sendputrequest, with body of: ', body);
    const res = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => result);

    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR');
    return null;
  }
};

const sendGetRequest = async function sendGetRequest(url, params) {
  try {
    console.log('in send get request with url of ', url, 'and params of ', params);
    const fullURL = url + (typeof params !== 'undefined' ? JSON.stringify(params.id) : '');
    const res = await fetch(fullURL, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => result);
    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR getting resource - from db module');
    // eslint-disable-next-line
    console.log(err);
    return null;
  }
};

const sendDeleteRequest = async function sendDeleteRequest(url) {
  try {
    console.log('using sendDeleteRequest with url of: ', url);
    const res = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => result);
    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR deleting request');
    // eslint-disable-next-line
    console.log(err);
    return null;
  }
};

const sendGetGroupsRequest = async function sendGetGroupsRequest(url) {
  try {
    const res = await fetch(url)
      .then((response) => response.json())
      .then((result) => result);
    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR');
    return null;
  }
};

module.exports = {
  sendPostRequest,
  sendGetRequest,
  sendPutRequest,
  sendGetGroupsRequest,
  sendDeleteRequest,
};
