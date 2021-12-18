const database = require('../DatabaseModule');

const getConvos = async (id) => {
  const response = await database.sendGetRequest(`http://localhost:8080/convo/${id}`);
  const convoInfo = [];
  console.log(response);
  for (let i = 0; i < response.length; i += 1) {
    let otherId = -1;
    let otherName = '';
    if (response[i].user1 === id) {
      otherId = response[i].user2;
      otherName = response[i].user2Name;
    } else {
      otherName = response[i].user1Name;
      otherId = response[i].user1;
    }

    convoInfo.push({ ...response[i], otherName, otherId });
  }

  return convoInfo;
};

const parseConvos = (changeState, convos) => {
  // remove all children in the box
  if (convos.length !== 0) {
    const element = document.getElementById('view-convos');

    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  for (let i = 0; i < convos.length; i += 1) {
    const convoBlock = `<div class="convo-container">
      <div class="convo-info"> <ul> <li id="convo-name">Messages with: ${convos[i].otherName} </li> </ul> </div> </div>`;
    const div = document.createElement('div');
    div.innerHTML = convoBlock;
    div.onclick = () => {
      changeState({ link: '/conversation', viewingConvo: { id: convos[i].convoId, otherUserId: convos[i].otherId } });
    };

    document.getElementById('view-convos').appendChild(div);
  }
};

const startConvo = async (state, updateMessages, updateState) => {
  // creates conversation in database
  const res = await database.sendGetRequest(`http://localhost:8080/user-by-name/${document.getElementById('otherName').value}`);
  console.log(res);
  if (res.length === 0) {
    updateState({ link: '/messages/user' });
    return null;
  }

  const otherId = res[0].user_id;

  const txt = document.getElementById('firstMsg').value;

  const msg = {
    txt,
    toId: otherId,
    fromId: state.userId,
    senderName: state.username,
    receiverName: res[0].user_name,
  };

  const response = await database.sendPostRequest(`http://localhost:8080/message/text/${otherId}`, { msg });

  if (typeof response.err !== 'undefined' && response.err === 'self') {
    updateState({ link: '/messages/error' });
    return null;
  }
  if (typeof response.err !== 'undefined' && response.err === 'group') {
    updateState({ link: '/messages/group' });
    return null;
  }

  await updateMessages();

  return response;
};

module.exports = {
  getConvos,
  parseConvos,
  startConvo,
};
