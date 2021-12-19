import sendUploadPostRequest from '../UploadModule';

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
    let msg = '';
    if (msgs[i].txt !== null) {
      msg = `${msgs[i].senderName}
        <div class="content txt">
          ${msgs[i].txt}
        </div>`;
    } else if (msgs[i].img !== null) {
      msg = `${msgs[i].senderName}
        <div class="content txt">
          <img src=${msgs[i].img} class="image" alt="${msgs[i].senderName}'s image" />
        </div>`;
    }

    const div = document.createElement('div');
    div.className = 'msg';
    div.id = (id === msgs[i].fromId ? 'i-sent' : 'they-sent');
    div.innerHTML = msg;
    document.getElementById('view-msgs').appendChild(div);
  }
};

const uploadImgConvo = async (selected, state, updateMessages) => {
  console.log(updateMessages);
  const file = document.getElementById('firstMsg').files[0];
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', ['yj7lgb8v']);
  console.log(data.get('upload_preset'));
  const res = sendUploadPostRequest('https://api.cloudinary.com/v1_1/cis557-project-group-18/image/upload', data).then((mediaUrl) => {
    // TODO change this to be right
    console.log('SENT IMAGE');
    console.log(res, mediaUrl, state);
    // creates conversation in database

    const msg = {
      toId: state.viewingConvo.otherUserId,
      fromId: state.userId,
      senderName: state.username,
      img: mediaUrl.data.url,
    };
    return database.sendPostRequest(`http://localhost:8080/message/image/${state.viewingConvo.otherUserId}`, { msg })
      .then((response) => {
        updateMessages().then(() => response);
      });
  });

  return null;
};

const sendMessage = async (updateConvo, selected, state) => {
  if (selected === 'audio') {
    console.log('waddup');
  } else if (selected === 'video') {
    console.log('waddup');
  } else if (selected === 'image') {
    return uploadImgConvo(selected, state, updateConvo);
  }

  const msg = {
    toId: state.viewingConvo.otherUserId,
    fromId: state.userId,
    senderName: state.username,
  };

  const txt = document.getElementById('firstMsg').value;
  msg.txt = txt;
  const response = await database.sendPostRequest(`http://localhost:8080/message/text/${state.viewingConvo.otherUserId}`, { msg });

  await updateConvo();

  return response;
};

export {
  getMessages,
  parseMessages,
  sendMessage,
};
