import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from './LoginForm.js';
import RegistrationForm from '../registration-page/RegistrationForm.js';

function LoginPage() {
  const [state, updateState] = useState('/');
    
  const changeLink = (link) => {
      window.history.pushState(null, '', link);
      updateState(link);
  };
    
  console.log(state);
  return (
    <Router>
      <div className="LoginPage">
          <div id="artSide">
            <div className="rectWrapper"> 
                <div className="rect" id="rect1"></div>
                <div className="rect" id="rect2"></div>
                <div className="rect" id="rect3"></div>
                <div className="rect" id="rect4"></div>
            </div>
          </div>
          <div id="loginFormContainer">
            {window.location.href.split('/').pop() === '' ? (<LoginForm changeLink={(link) => changeLink(link)} id="loginForm"/>) : (<RegistrationForm key={'registrationForm'} changeLink={(link) => changeLink(link)} id="registrationForm" />) }
          </div>
      </div>
    </Router>
  );
}

export default LoginPage;
