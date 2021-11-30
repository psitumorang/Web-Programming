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
    const response = await sendPutRequest('http://localhost:8080/registration', reqBody);
    // eslint-disable-next-line no-console
    console.log('printing response ', response);
  }
  // eslint-disable-next-line no-console
  console.log('why isn\'t this working?');
};

const showMessage = (message) => (
  <div>
    <p />
    {message}
    <p />
  </div>
);

const UpdatePassword = (id) => {
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
      <input id="createButton" type="submit" value="Create Account" onClick={() => changePassword(document.getElementById('changepassword1'), document.getElementById('changepassword2'), id, updateMessage)} />
    </div>
  );
};

export default UpdatePassword;
