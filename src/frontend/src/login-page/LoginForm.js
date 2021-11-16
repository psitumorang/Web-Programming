import React from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';

const lib = require('./LoginModule');

function LoginForm(props) {
  const { changeLink } = props;

  return (
    <div className="LoginForm">
      <h1>Welcome!</h1>
      {window.location.href.split('/').pop() === 'error' ? (<p>Username or password does not exist.</p>) : null}
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
        <Link id="registrationLink" to="/registration" onClick={() => changeLink('/registration')}> Create an account. </Link>
      </p>
      <Link to="/main" onClick={() => lib.verifyUser(changeLink, document.getElementById('username').value, document.getElementById('password').value)}>
        <input id="loginButton" type="submit" value="Login" />
      </Link>
    </div>
  );
}

export default LoginForm;
