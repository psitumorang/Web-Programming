import { React, useState } from 'react';
import './LoginPage.css';
import LoginForm from './LoginForm';
import RegistrationForm from '../registration-page/RegistrationForm';
import ChangePasswordForm from './ChangePasswordForm';

function LoginPage(props) {
  const { changeState } = props;
  const [attempt, addAttempt] = useState(0);

  const conditionalRender = () => {
    if (window.location.href.split('/').pop() === '' || window.location.href.split('/')[3] === 'error' || window.location.href.split('/')[3] === 'locked') {
      return (<LoginForm changeState={(input) => changeState(input)} id="loginForm" attempt={attempt} addAttempt={(i) => addAttempt(i)} />);
    }
    if (window.location.href.split('/')[3] === 'loginchangepassword') {
      return (<ChangePasswordForm changeState={(input) => changeState(input)} />);
    }
    if (window.location.href.split('/')[3] === 'registration') {
      return (<RegistrationForm key="registrationForm" changeState={(input) => changeState(input)} id="registrationForm" />);
    }
    return null;
  };

  return (
    <div className="LoginPage">
      <div id="artSide">
        <div className="rectWrapper">
          <div className="rect" id="rect1" />
          <div className="rect" id="rect2" />
          <div className="rect" id="rect3" />
          <div className="rect" id="rect4" />
        </div>
      </div>
      <div id="loginFormContainer">
        {conditionalRender()}
      </div>
    </div>
  );
}

export default LoginPage;
