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

module.exports = {
  sendPostRequest,
};
