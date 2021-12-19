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
    } else if (msgs[i].audio !== null) {
      msg = `${msgs[i].senderName}
        <div class="content txt">
          <audio controls>
            <source src=${msgs[i].audio}>
          </audio>
        </div>`;
    } else if (msgs[i].video !== null) {
      msg = `${msgs[i].senderName}
        <div class="content txt">
          <video src=${msgs[i].video} controls>
            Something went wrong!
          </video>
        </div>`;
    }

    const div = document.createElement('div');
    div.className = 'msg';
    div.id = (id === msgs[i].fromId ? 'i-sent' : 'they-sent');
    div.innerHTML = msg;
    document.getElementById('view-msgs').appendChild(div);
  }
};

const uploadMediaConvo = async (selected, state, updateMessages, updateState) => {
  console.log(updateMessages);
  const file = document.getElementById('firstMsg').files[0];

  // check if the file is too large (defined as > 10MB)
  if (selected === 'image' && file.size > 10000000) {
    updateState({ link: '/conversation/img' });
    return null;
  }
  if ((selected === 'audio' || selected === 'video') && file.size > 100000000) {
    updateState({ link: '/conversation/av' });
    return null;
  }

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', ['yj7lgb8v']);
  console.log(data.get('upload_preset'));
  const res = sendUploadPostRequest(`https://api.cloudinary.com/v1_1/cis557-project-group-18/${selected === 'image' ? 'image' : 'video'}/upload`, data).then((mediaUrl) => {
    // TODO change this to be right
    console.log('SENT MEDIA');
    console.log(res, mediaUrl, state);
    // creates conversation in database

    const msg = {
      toId: state.viewingConvo.otherUserId,
      fromId: state.userId,
      senderName: state.username,
    };

    if (selected === 'image') {
      msg.img = mediaUrl.data.url;
    } else if (selected === 'video') {
      msg.video = mediaUrl.data.url;
    } else {
      msg.audio = mediaUrl.data.url;
    }

    return database.sendPostRequest(`http://localhost:8080/message/${selected}/${state.viewingConvo.otherUserId}`, { msg })
      .then((response) => {
        updateMessages().then(() => response);
      });
  });

  return null;
};

const sendMessage = async (updateConvo, selected, state, updateState) => {
  if (selected === 'audio') {
    return uploadMediaConvo(selected, state, updateConvo, updateState);
  }
  if (selected === 'video') {
    return uploadMediaConvo(selected, state, updateConvo, updateState);
  }
  if (selected === 'image') {
    return uploadMediaConvo(selected, state, updateConvo, updateState);
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
