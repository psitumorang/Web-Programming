const database = require('../DatabaseModule');

const getMessages = async (convoId) => {
  const response = await database.sendGetRequest(`http://localhost:8080/message/${convoId}`);
  console.log(response);
  return response;
};

const parseMessages = (msgs, id) => {
  // remove all children in the box
  if (msgs.length !== 0) {
    const element = document.getElementById('view-msgs');

    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  for (let i = 0; i < msgs.length; i += 1) {
    console.log(msgs[i]);
    const msg = `${msgs[i].senderName}
      <div class="content txt">
        ${msgs[i].txt}
      </div>`;

    const div = document.createElement('div');
    div.className = 'msg';
    div.id = (id === msgs[i].fromId ? 'i-sent' : 'they-sent');
    div.innerHTML = msg;
    document.getElementById('view-msgs').appendChild(div);
  }
};

const sendMessage = async (state, updateState) => {
  const txt = document.getElementById('sendMsgTxt').value;

  const msg = {
    txt,
    toId: state.viewingConvo.otherUserId,
    fromId: state.userId,
    senderName: state.username,
  };

  const response = await database.sendPostRequest(`http://localhost:8080/message/text/${state.viewingConvo.otherUserId}`, { msg });

  await updateState();

  return response;
};

module.exports = {
  getMessages,
  parseMessages,
  sendMessage,
};
