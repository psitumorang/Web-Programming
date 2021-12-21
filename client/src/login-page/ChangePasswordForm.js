import React from 'react';
import './LoginForm.css';

const lib = require('./LoginModule');

function ChangePasswordForm(props) {
  const { changeState } = props;

  return (
    <div className="ChangePasswordForm">
      <h1>Welcome!</h1>
      {(window.location.href.split('/').pop() === 'invalid') ? (<p>Password confirmation does not match password.</p>) : null}
      {(window.location.href.split('/').pop() === 'user') ? (<p>Username does not exist.</p>) : null}
      <div className="textDiv" id="usernameDiv">
        <label htmlFor="username">
          Username:
          <input className="text" id="username" type="text" placeholder="username" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password1">
          New password:
          <input className="text" id="password1" type="password" placeholder="password" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password2">
          Confirm new password:
          <input className="text" id="password2" type="password" placeholder="password" />
        </label>
      </div>
      <input id="createButton" type="submit" value="Update password" onClick={() => lib.changePassword(changeState, document.getElementById('username').value, document.getElementById('password1').value, document.getElementById('password2').value)} />
    </div>
  );
}

export default ChangePasswordForm;
