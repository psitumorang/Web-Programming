import sendUploadPostRequest from '../UploadModule';

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

const uploadImgConvo = async (selected, state, updateMessages, updateState) => {
  const file = document.getElementById('firstMsg').files[0];
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', ['yj7lgb8v']);
  console.log(data.get('upload_preset'));
  const res = sendUploadPostRequest('https://api.cloudinary.com/v1_1/cis557-project-group-18/image/upload', data).then((mediaUrl) => {
    // TODO change this to be right
    console.log('SENT IMAGE');
    console.log(res, mediaUrl);
    // creates conversation in database
    return database.sendGetRequest(`http://localhost:8080/user-by-name/${document.getElementById('otherName').value}`).then((resp) => {
      console.log(resp);
      if (resp.length === 0) {
        // MAYBE MAKE THIS THE ERROR PAGE DUDE?!?!?!?!?!
        updateState({ link: '/messages/user' });
        return null;
      }

      const otherId = resp[0].user_id;

      const msg = {
        toId: otherId,
        fromId: state.userId,
        senderName: state.username,
        receiverName: resp[0].user_name,
        img: mediaUrl.data.url,
      };
      return database.sendPostRequest(`http://localhost:8080/message/image/${otherId}`, { msg }).then((response) => {
        if (typeof response.err !== 'undefined' && response.err === 'self') {
          updateState({ link: '/messages/error' });
          return null;
        }
        if (typeof response.err !== 'undefined' && response.err === 'group') {
          updateState({ link: '/messages/group' });
          return null;
        }

        return updateMessages().then(() => response);
      });
    });
  });
  return null;
};

const startConvo = async (selected, state, updateMessages, updateState) => {
  if (selected === 'audio') {
    console.log('hi');
  } else if (selected === 'video') {
    console.log('hi');
  } else if (selected === 'image') {
    return uploadImgConvo(selected, state, updateMessages, updateState);
  }

  // creates conversation in database
  const res = await database.sendGetRequest(`http://localhost:8080/user-by-name/${document.getElementById('otherName').value}`);
  console.log(res);
  if (res.length === 0) {
    updateState({ link: '/messages/user' });
    return null;
  }

  const otherId = res[0].user_id;

  const msg = {
    toId: otherId,
    fromId: state.userId,
    senderName: state.username,
    receiverName: res[0].user_name,
    txt: document.getElementById('firstMsg').value,
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

export {
  getConvos,
  parseConvos,
  startConvo,
};
