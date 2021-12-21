const sendPostRequest = async function sendPostRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
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

const sendUploadPostRequest = async function sendUploadPostRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body,
    })
      .then((response) => response.json())
      .then((result) => result);

    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
    return null;
  }
};

const sendPutRequest = async function sendPutRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: 'PUT',
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
    const fullURL = url + (typeof params !== 'undefined' ? JSON.stringify(params.id) : '');
    const res = await fetch(fullURL, {
      method: 'GET',
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
    const res = await fetch(url, {
      method: 'DELETE',
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

const sendBodiedDeleteRequest = async function sendBodiedDeleteRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
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

export {
  sendPostRequest,
  sendGetRequest,
  sendPutRequest,
  sendGetGroupsRequest,
  sendDeleteRequest,
  sendBodiedDeleteRequest,
  sendUploadPostRequest,
};
