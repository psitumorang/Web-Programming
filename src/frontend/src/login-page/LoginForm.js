import React from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';

const lib = require('./LoginModule');

function LoginForm(props) {
  const { changeState, addAttempt, attempt } = props;

  const message = `Username or password does not exist. You have ${3 - attempt} more tries`;

  return (
    <div className="LoginForm">
      <h1>Welcome!</h1>
      {window.location.href.split('/').pop() === 'error' ? (
        <p>
          {message}
        </p>
      ) : null}
      {window.location.href.split('/').pop() === 'locked' ? (
        <div>
          <p>Your account is locked out.</p>
          <p>Please wait about 30 minutes to log back in. RIP</p>
        </div>
      ) : null}
      <div className="textDiv" id="usernameDiv">
        <label htmlFor="username">
          Username:
          <input className="text" id="username" type="text" placeholder="username" />
        </label>
      </div>
      <div className="textDiv" id="passwordDiv">
        <label htmlFor="password">
          Password:
          <input className="text" id="password" type="password" placeholder="password" />
        </label>
      </div>
      <p>
        Not a user?
        <Link id="registrationLink" to="/registration" onClick={() => changeState({ link: '/registration' })}> Create an account. </Link>
      </p>
      <p>
        Forgot your password?
        <Link id="passwordLink" to="/loginchangepassword" onClick={() => changeState({ link: '/changepassword' })}> Create a new password. </Link>
      </p>
      <Link to="/main" onClick={() => lib.verifyUser(changeState, document.getElementById('username').value, document.getElementById('password').value, addAttempt, attempt)}>
        <input id="loginButton" type="submit" value="Login" />
      </Link>
    </div>
  );
}

export default LoginForm;
