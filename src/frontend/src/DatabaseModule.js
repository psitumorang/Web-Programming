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

const sendGetRequest = async function sendGetRequest(url, params) {
  try {
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
  sendGetGroupsRequest,
};
