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
    console.log('trying sendGetRequest in DatabaseModule with URL: ', url, 'and params to be stuck in fullURL: ', params);
    const fullURL = url + JSON.stringify(params.id);
    console.log('trying fetch with fullURL of ', fullURL);
    const res = await fetch(fullURL, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => result);

    console.log('printing result of sendGetRequest ', res);
    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR getting posts');
    console.log(err.message);
    return null;
  }
};

module.exports = {
  sendPostRequest,
  sendGetRequest,
};
