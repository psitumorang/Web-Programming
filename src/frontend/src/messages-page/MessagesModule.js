const database = require('../DatabaseModule');

const getConvos = async (id, changeState) => {
  const response = await database.sendGetRequest(`http://localhost:8080/convo/${id}`);
  console.log(response);
  const convoInfo = [];
    
  for (let i = 0; i < response.length; i += 1) {
    let otherId = -1;
    if (response[i].user1 === id) {
      otherId = response[i].user2;
    } else {
      otherId = response[i].user1;
    }

    const name = await database.sendGetRequest(`http://localhost:8080/user/${otherId}`);

    if (name !== null) {
      changeState({ link: '/messages' });
    } else {
      changeState({ link: '/error' });
    }
    const otherName = name[0].user_name;
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

  console.log(convos.length, convos);
  for (let i = 0; i < convos.length; i += 1) {
    console.log(convos[i]);
    const convoBlock = `<div class="convo-container">
      <div class="group-info"> <ul> <li id="group-name">Messages with: ${convos[i].otherName} </li> </ul> </div> </div>`;
    console.log(convoBlock);
    const div = document.createElement('div');
    div.innerHTML = convoBlock;
    div.onclick = () => { console.log('will be view message page'); };

    document.getElementById('view-convos').appendChild(div);
  }
};

module.exports = {
  getConvos,
  parseConvos,
};
