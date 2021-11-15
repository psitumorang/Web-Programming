import React from 'react';
import '../login-page/LoginForm.css';

function RegistrationForm(props) {
  const { changeLink } = props;

  const renderWarnings = () => {
    if (window.location.href.split('/').pop() === 'invalid') {
      return (<p>Password confirmation does not match password.</p>);
    } if (window.location.href.split('/').pop() === 'user') {
      return (<p>This username has already been taken.</p>);
    }
    return null;
  };

  return (
    <div className="RegistrationForm">
      <h1>Welcome!</h1>
      {renderWarnings()}
      <div className="textDiv" id="usernameDiv">
        <label htmlFor="username">
          Username:
          <input className="text" id="username" type="text" placeholder="username" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password1">
          Password:
          <input className="text" id="password1" type="password" placeholder="password" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password2">
          Confirm Password:
          <input className="text" id="password2" type="password" placeholder="password" />
        </label>
      </div>
      <input id="createButton" type="submit" value="Create Account" onClick={() => createAccount(changeLink, document.getElementById('username').value, document.getElementById('password1').value, document.getElementById('password2').value)} />
    </div>
  );
}

export default RegistrationForm;
