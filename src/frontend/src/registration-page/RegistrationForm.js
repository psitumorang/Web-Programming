import React from 'react';
import '../login-page/LoginForm.css';

function RegistrationForm(props) {
  const { changeLink } = props;

  const validatePassword = () => {
    if (document.getElementById('password1').value !== document.getElementById('password2').value) {
      changeLink('/registration/invalid');
    } else {
      changeLink('/main');
    }
  };

  return (
    <div className="RegistrationForm">
      <h1>Welcome!</h1>
      {(window.location.href.split('/').pop() !== 'invalid') ? null : <p>Password confirmation does not match password.</p>}
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
      <input type="submit" value="Create Account" onClick={validatePassword} />
    </div>
  );
}

export default RegistrationForm;
