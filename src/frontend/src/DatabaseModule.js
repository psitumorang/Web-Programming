const sendPostRequest = async function sendPostRequest(url, body) {
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
  // eslint-disable-next-line
  console.log('here we are in sendPutRequest at DBModule with url of ', url, ' and body of ', body);
  try {
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
    // eslint-disable-next-line
    console.log('at dbmodule.js frontend, sendGetRequest, with params.id of ', params.id);
    const fullURL = url + JSON.stringify(params.id);
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
    console.log('ERROR getting posts');
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
};
