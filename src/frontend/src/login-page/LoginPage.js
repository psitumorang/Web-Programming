import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from './LoginForm';
import RegistrationForm from '../registration-page/RegistrationForm';

function LoginPage(props) {
  const { changeState } = props;

  return (
    <Router>
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
          {window.location.href.split('/').pop() === '' || window.location.href.split('/').pop() === 'error' ? (<LoginForm changeState={(input) => changeState(input)} id="loginForm" />) : (<RegistrationForm key="registrationForm" changeState={(input) => changeState(input)} id="registrationForm" />) }
        </div>
      </div>
    </Router>
  );
}

export default LoginPage;
