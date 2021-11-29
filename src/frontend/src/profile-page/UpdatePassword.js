import React, { useState } from 'react';

const { createHash } = require('crypto');
const { sendPutRequest } = require('../DatabaseModule');

const changePassword = async (pass1, pass2, userId, updateMessage) => {
  if (pass1 !== pass2) {
    updateMessage('the two passwords don\'t match - try again!');
  } else {
    // update in DB
    const userPassword = createHash('sha256').update(pass1).digest('hex');
    const reqBody = { id: userId, user_password: userPassword };

    // need put request
    const url = `http://localhost:8080/user/${userId}`;
    const response = await sendPutRequest(url, reqBody);
    console.log('printing response ', response);

    updateMessage('password updated successfully!');
  }
  return 0;
};

const changeBio = async function (newBio, userId, updateMessage) {
  const reqBody = { id: userId, biography: newBio };

  const url = `http://localhost:8080/profile/${userId}`;
  const response = await sendPutRequest(url, reqBody);
  console.log('printing response ', response);

  updateMessage('bio updated successfully!');
};

const showMessage = (message) => 
  <div>
    <p />
    {message}
    <p />
  </div>
);

const UpdatePassword = (props) => {
  const { userId } = props;
  const [message, mutateMessage] = useState('');

  const updateMessage = (newMessage) => {
    mutateMessage(newMessage);
  };

  return (
    <div>
      {showMessage(message)}
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password1">
          New password:
          <input className="text" id="changepassword1" type="password" placeholder="password" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password2">
          Confirm new password:
          <input className="text" id="changepassword2" type="password" placeholder="password" />
        </label>
      </div>
      <input id="updatePasswordButton" type="submit" value="Update Password" onClick={() => changePassword(document.getElementById('changepassword1').value, document.getElementById('changepassword2').value, userId, updateMessage)} />
      <p />
      <div className="textDiv" id="newBioDiv">
        <label htmlFor="newBio">
          New bio:
          <input className="text" id="newBioInput" type="text" placeholder="Enter new Bio text here" />
        </label>
      </div>
      <input id="updateBioButton" type="submit" value="Update Bio" onClick={() => changeBio(document.getElementById('newBioInput').value, userId, updateMessage)} />
      <p />
      <input id="updatePasswordButton" type="submit" value="Back to profile page" onClick={() => props.changeState({ link: '/profile', id: userId })} />
    </div>
  );
};

export default UpdatePassword;
