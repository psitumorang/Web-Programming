const createUser = async function createUser(body) {
  const url = 'http://localhost:8080/registration';
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

// const getComments

module.exports = {
  createUser,
};
